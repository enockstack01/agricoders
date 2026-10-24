import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/theme';
import { AppText, Card, EmptyState, PageHeader, SkeletonList, useLayout } from '../../components/ui';
import { TextField } from '../../components/fields';
import { PressableScale } from '../../components/PressableScale';
import { Initials, ROLE_LABEL, RoleBadge, timeAgo } from '../../components/admin';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/Confirm';
import { haptics } from '../../lib/haptics';
import { useAdminUsers, useSetUserRole, AdminUser } from '../../lib/useAdmin';
import type { NavRole } from '../../lib/useResource';

const ROLES: NavRole[] = ['user', 'admin', 'super_admin'];

/** User Management (super admins only): see everyone and change their role. */
export function UserManagementScreen() {
  const { colors } = useTheme();
  const { gutter, isWide } = useLayout();
  const { user: me } = useUser();
  const toast = useToast();
  const confirm = useConfirm();
  const users = useAdminUsers();
  const setRole = useSetUserRole();
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = users.data?.users ?? [];
    return q ? all.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : all;
  }, [users.data, search]);

  const change = async (u: AdminUser, role: NavRole) => {
    if (role === u.role) return;
    const ok = await confirm(`Change ${u.name} from ${ROLE_LABEL[u.role]} to ${ROLE_LABEL[role]}?`, {
      confirmLabel: 'Change role',
      danger: role === 'super_admin',
    });
    if (!ok) return;
    try {
      await setRole.mutateAsync({ userId: u.id, role });
      haptics.success();
      toast(`${u.name} is now ${ROLE_LABEL[role]}. The change shows after they next sign in or refresh.`, 'success');
    } catch (e: any) {
      toast(e?.message || 'Could not change the role', 'error');
    }
  };

  return (
    <FlatList
      data={users.isLoading ? [] : list}
      keyExtractor={(u) => u.id}
      contentContainerStyle={[
        { paddingHorizontal: gutter, paddingTop: 20, paddingBottom: 60, gap: spacing.md },
        isWide ? { maxWidth: 1000, width: '100%', alignSelf: 'center' } : null,
      ]}
      refreshControl={<RefreshControl refreshing={users.isRefetching} onRefresh={() => users.refetch()} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={{ gap: spacing.md, marginBottom: 4 }}>
          <PageHeader title="User Management" subtitle="Choose who is a user, an admin or a super admin" />
          <TextField icon="magnifying-glass" placeholder="Search users by name or email" value={search} onChangeValue={setSearch} autoCapitalize="none" />
          {users.isLoading ? <SkeletonList rows={4} /> : null}
        </View>
      }
      renderItem={({ item }) => {
        const isSelf = item.id === me?.id;
        return (
          <Card style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Initials name={item.name} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText weight="700" numberOfLines={1} style={{ fontSize: 16 }}>{item.name}{isSelf ? ' (you)' : ''}</AppText>
                <AppText variant="caption" numberOfLines={1}>{item.email}</AppText>
                <AppText variant="caption">{item.submissionCount} plan{item.submissionCount === 1 ? '' : 's'} · active {timeAgo(item.lastActive)}</AppText>
              </View>
              <RoleBadge role={item.role} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {ROLES.map((r) => {
                const active = item.role === r;
                const disabled = isSelf || setRole.isPending;
                return (
                  <PressableScale
                    key={r}
                    onPress={() => change(item, r)}
                    disabled={disabled || active}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active, disabled }}
                    style={{
                      flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1,
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                      opacity: disabled && !active ? 0.45 : 1,
                    }}
                  >
                    <AppText weight="700" style={{ fontSize: 13, color: active ? '#FFFFFF' : colors.text }}>{ROLE_LABEL[r]}</AppText>
                  </PressableScale>
                );
              })}
            </View>
            {isSelf ? <AppText variant="caption">You cannot change your own role.</AppText> : null}
          </Card>
        );
      }}
      ListEmptyComponent={
        users.isLoading ? null : users.isError ? (
          <EmptyState icon="circle-exclamation" title="Could not load users" description={(users.error as any)?.message} actionLabel="Try again" onAction={() => users.refetch()} />
        ) : (
          <EmptyState icon="users" title={search ? `No users match "${search}"` : 'No users yet'} />
        )
      }
      ListFooterComponent={list.length > 0 ? <AppText variant="caption" style={{ textAlign: 'center' }}>{list.length} of {users.data?.total ?? list.length} users</AppText> : null}
    />
  );
}
