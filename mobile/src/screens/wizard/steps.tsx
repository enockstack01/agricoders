import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/theme';
import { AppText, Grid, StatTile, useLayout } from '../../components/ui';
import { DateField, SelectField, TextAreaField, TextField } from '../../components/fields';
import {
  AddRowButton, AIButton, Callout, COMPANY_TYPES, CURRENCIES, FormSection, ItemCard, NumField, PercentField, StringList,
} from '../../components/planFields';
import { useToast } from '../../components/Toast';
import { generateWithAI, PlanInput } from '../../lib/useResource';
import { computeFinancials } from '../../shared/calculations';
import { DELIVERY_MODELS, PRICING_MODELS, SERVICE_TYPES } from '../../shared/types';
import type { BusinessDescription, FinancialData, MarketAnalysis, RevenuePackage } from '../../shared/types';

/*
 * The ten plan-wizard steps — same fields, units and AI-assist sections as the website's
 * components/form/Step*.tsx, laid out for phones (stacked fields, item cards instead of tables).
 * Rates are stored as fractions (0.3) and edited as percentages (30), exactly like the website.
 */

export type StepProps = {
  data: PlanInput;
  update: <K extends keyof PlanInput>(key: K, value: PlanInput[K]) => void;
};

const fmt = (n: number) => Math.round(n || 0).toLocaleString('en-US');

/** Calls the website's AI endpoint with the plan's context; shared by steps 2 and 3. */
function useAI(data: PlanInput) {
  const toast = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const ci = data.companyInfo;
  const run = async (section: string, apply: (content: any) => void) => {
    if (!ci.companyName && !ci.companyFocus) {
      toast('Fill in Company Name and Industry in Step 1 first', 'warning');
      return;
    }
    setLoading((l) => ({ ...l, [section]: true }));
    try {
      const content = await generateWithAI(section, {
        companyName: ci.companyName, companyFocus: ci.companyFocus, location: ci.location,
        companyType: ci.companyType, productName: ci.productName, currency: ci.currency,
        products: data.businessDescription.products,
        existingVision: data.businessDescription.vision, existingMission: data.businessDescription.mission,
      });
      apply(content);
      toast('Generated — review and edit as needed', 'success');
    } catch (e: any) {
      toast(`AI generation failed: ${e?.message || 'unknown error'}`, 'error');
    } finally {
      setLoading((l) => ({ ...l, [section]: false }));
    }
  };
  return { run, loading };
}

/* ------------------------------------------------------------ 1 Company */
export function CompanyStep({ data, update }: StepProps) {
  const { columns } = useLayout();
  const ci = data.companyInfo;
  const set = (k: keyof typeof ci, v: string) => update('companyInfo', { ...ci, [k]: v });
  const cols = columns >= 2 ? 2 : 1;
  return (
    <View style={{ gap: spacing.lg }}>
      <AppText variant="subtitle" style={{ fontSize: 13 }}>Enter your company and author information. It appears on the cover page of your business plan.</AppText>
      <FormSection title="Author Information">
        <Grid columns={cols} gap={spacing.md}>
          <TextField label="Author Full Name" required value={ci.authorName} onChangeValue={(v) => set('authorName', v)} placeholder="Your full name" />
          <TextField label="Author Title" required value={ci.authorTitle} onChangeValue={(v) => set('authorTitle', v)} placeholder="Founder & CEO" />
          <TextField label="Phone Number" value={ci.phone} onChangeValue={(v) => set('phone', v)} keyboardType="phone-pad" placeholder="+250 7xx xxx xxx" />
          <TextField label="Email Address" value={ci.email} onChangeValue={(v) => set('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="you@company.com" />
        </Grid>
      </FormSection>
      <FormSection title="Company Information">
        <Grid columns={cols} gap={spacing.md}>
          <TextField label="Company Name" required value={ci.companyName} onChangeValue={(v) => set('companyName', v)} placeholder="Your company name" />
          <TextField label="Product / Project Name" required value={ci.productName} onChangeValue={(v) => set('productName', v)} placeholder="Your flagship product or project" />
          <TextField label="Location / Country" value={ci.location} onChangeValue={(v) => set('location', v)} placeholder="e.g. Kigali, Rwanda" />
          <SelectField label="Company Type" value={ci.companyType} onChangeValue={(v) => set('companyType', v)} options={COMPANY_TYPES} />
          <TextField label="Industry / Company Focus" value={ci.companyFocus} onChangeValue={(v) => set('companyFocus', v)} placeholder="e.g. AgriTech, Poultry" />
          <SelectField label="Currency" required value={ci.currency} onChangeValue={(v) => set('currency', v)} options={CURRENCIES.includes(ci.currency) ? CURRENCIES : [ci.currency, ...CURRENCIES]} placeholder="" />
          <TextField label="Company Website" value={ci.website ?? ''} onChangeValue={(v) => set('website', v)} autoCapitalize="none" placeholder="https://" />
        </Grid>
      </FormSection>
      <FormSection title="Submission Details">
        <Grid columns={cols} gap={spacing.md}>
          <TextField label="Submitted To (Name / Title)" value={ci.submittedTo} onChangeValue={(v) => set('submittedTo', v)} placeholder="e.g. Loan Officer, Bank of Kigali" />
          <DateField label="Submission Date" value={ci.submissionDate} onChangeValue={(v) => set('submissionDate', v)} />
        </Grid>
      </FormSection>
      {ci.companyLogo ? <Callout tone="info">Your company logo (added on the website) is kept and will appear on the cover page.</Callout> : null}
    </View>
  );
}

/* ----------------------------------------------------- 2 Business description */
export function BusinessStep({ data, update }: StepProps) {
  const bd = data.businessDescription;
  const set = <K extends keyof BusinessDescription>(k: K, v: BusinessDescription[K]) => update('businessDescription', { ...bd, [k]: v });
  const ai = useAI(data);
  const pairList = (key: 'values' | 'products', addLabel: string, namePh: string) => (
    <View style={{ gap: spacing.md }}>
      {bd[key].map((item, i) => (
        <ItemCard key={i} title={item.name || `${addLabel.replace('Add ', '')} ${i + 1}`} onRemove={() => set(key, bd[key].filter((_, j) => j !== i))}>
          <TextField label="Name" value={item.name} placeholder={namePh} onChangeValue={(v) => { const a = [...bd[key]]; a[i] = { ...a[i], name: v }; set(key, a); }} />
          <TextAreaField label="Description" value={item.description} onChangeValue={(v) => { const a = [...bd[key]]; a[i] = { ...a[i], description: v }; set(key, a); }} />
        </ItemCard>
      ))}
      <AddRowButton label={addLabel} onPress={() => set(key, [...bd[key], { name: '', description: '' }])} />
    </View>
  );
  return (
    <View style={{ gap: spacing.lg }}>
      <Callout tone="info">✨ AI Assist — tap any "Generate with AI" button to draft that section from your Step 1 company info. You can edit everything.</Callout>
      <FormSection title="Vision & Mission">
        <View style={{ gap: 6 }}>
          <View style={{ alignSelf: 'flex-end' }}><AIButton loading={ai.loading.vision} onPress={() => ai.run('vision', (d) => set('vision', String(d)))} /></View>
          <TextAreaField label="Vision" value={bd.vision} onChangeValue={(v) => set('vision', v)} placeholder="Where do you want the business to be?" />
        </View>
        <View style={{ gap: 6 }}>
          <View style={{ alignSelf: 'flex-end' }}><AIButton loading={ai.loading.mission} onPress={() => ai.run('mission', (d) => set('mission', String(d)))} /></View>
          <TextAreaField label="Mission" value={bd.mission} onChangeValue={(v) => set('mission', v)} placeholder="What do you do, for whom, and how?" />
        </View>
      </FormSection>
      <FormSection title="Goals">
        {([['shortTermGoals', 'Short-term (0–1 year)'], ['mediumTermGoals', 'Medium-term (1–3 years)'], ['longTermGoals', 'Long-term (3+ years)']] as const).map(([k, label]) => (
          <View key={k} style={{ gap: 6 }}>
            <AppText variant="label">{label}</AppText>
            <StringList items={bd[k]} onChange={(v) => set(k, v)} addLabel="Add goal" placeholder="Goal" />
          </View>
        ))}
      </FormSection>
      <FormSection title="Core Values" right={<AIButton loading={ai.loading.values} onPress={() => ai.run('values', (d) => set('values', d))} />}>
        {pairList('values', 'Add value', 'e.g. Integrity')}
      </FormSection>
      <FormSection title="Products & Services">{pairList('products', 'Add product/service', 'e.g. Organic tomatoes')}</FormSection>
      <FormSection title="How It Works (Operating Model)" right={<AIButton loading={ai.loading.workingModelSteps} onPress={() => ai.run('workingModelSteps', (d) => set('workingModelSteps', d))} />}>
        <StringList items={bd.workingModelSteps} onChange={(v) => set('workingModelSteps', v)} addLabel="Add step" placeholder="Step" />
      </FormSection>
      <FormSection title="Technologies Used" right={<AIButton loading={ai.loading.technologies} onPress={() => ai.run('technologies', (d) => set('technologies', d))} />}>
        <StringList items={bd.technologies} onChange={(v) => set('technologies', v)} addLabel="Add technology" placeholder="Technology" />
      </FormSection>
      <FormSection title="SWOT Analysis" right={<AIButton label="Generate SWOT" loading={ai.loading.swot} onPress={() => ai.run('swot', (d) => set('swot', d))} />}>
        {(['strengths', 'weaknesses', 'opportunities', 'threats'] as const).map((k) => (
          <View key={k} style={{ gap: 6 }}>
            <AppText variant="label" style={{ textTransform: 'capitalize' }}>{k}</AppText>
            <StringList items={bd.swot[k]} onChange={(v) => set('swot', { ...bd.swot, [k]: v })} addLabel={`Add ${k.replace(/s$/, '').replace(/ie$/, 'y')}`} />
          </View>
        ))}
      </FormSection>
      <FormSection title="PESTEL Analysis" right={<AIButton label="Generate PESTEL" loading={ai.loading.pestel} onPress={() => ai.run('pestel', (d) => set('pestel', d))} />}>
        {(['political', 'economic', 'social', 'technological', 'environmental', 'legal'] as const).map((k) => (
          <TextAreaField key={k} label={k[0].toUpperCase() + k.slice(1)} value={bd.pestel[k]} onChangeValue={(v) => set('pestel', { ...bd.pestel, [k]: v })} />
        ))}
      </FormSection>
    </View>
  );
}

/* ------------------------------------------------------- 3 Market analysis */
export function MarketStep({ data, update }: StepProps) {
  const { columns } = useLayout();
  const ma = data.marketAnalysis;
  const set = <K extends keyof MarketAnalysis>(k: K, v: MarketAnalysis[K]) => update('marketAnalysis', { ...ma, [k]: v });
  const ai = useAI(data);
  const pairs = (key: 'targetSegments' | 'competitors', addLabel: string) => (
    <View style={{ gap: spacing.md }}>
      {ma[key].map((item, i) => (
        <ItemCard key={i} title={item.name || `${addLabel.replace('Add ', '')} ${i + 1}`} onRemove={() => set(key, ma[key].filter((_, j) => j !== i))}>
          <TextField label="Name" value={item.name} onChangeValue={(v) => { const a = [...ma[key]]; a[i] = { ...a[i], name: v }; set(key, a); }} />
          <TextAreaField label="Description" value={item.description} onChangeValue={(v) => { const a = [...ma[key]]; a[i] = { ...a[i], description: v }; set(key, a); }} />
        </ItemCard>
      ))}
      <AddRowButton label={addLabel} onPress={() => set(key, [...ma[key], { name: '', description: '' }])} />
    </View>
  );
  return (
    <View style={{ gap: spacing.lg }}>
      <FormSection title="Global Market Size (USD Billions)">
        <Grid columns={columns >= 2 ? 3 : 1} gap={spacing.md}>
          <NumField label="Market Size 2024 ($B)" value={ma.globalMarketSize2024} onChange={(v) => set('globalMarketSize2024', v)} />
          <NumField label="Market Size 2025 ($B)" value={ma.globalMarketSize2025} onChange={(v) => set('globalMarketSize2025', v)} />
          <NumField label="Market Size 2030 ($B)" value={ma.globalMarketSize2030} onChange={(v) => set('globalMarketSize2030', v)} />
        </Grid>
        <Grid columns={columns >= 2 ? 2 : 1} gap={spacing.md}>
          <NumField label="Sector GDP Contribution (%)" value={ma.gdpContribution} onChange={(v) => set('gdpContribution', v)} />
          <NumField label="Sector Employment (%)" value={ma.employmentPercentage} onChange={(v) => set('employmentPercentage', v)} />
        </Grid>
      </FormSection>
      <FormSection title="Target Market Segments" right={<AIButton label="Generate segments" loading={ai.loading.marketSegments} onPress={() => ai.run('marketSegments', (d) => set('targetSegments', d))} />}>
        {pairs('targetSegments', 'Add segment')}
      </FormSection>
      <FormSection title="Competitor Analysis" right={<AIButton label="Suggest competitors" loading={ai.loading.competitors} onPress={() => ai.run('competitors', (d) => set('competitors', d))} />}>
        {pairs('competitors', 'Add competitor')}
      </FormSection>
      <FormSection title="Marketing Strategies" right={<AIButton loading={ai.loading.marketingStrategies} onPress={() => ai.run('marketingStrategies', (d) => set('marketingStrategies', d))} />}>
        <StringList items={ma.marketingStrategies} onChange={(v) => set('marketingStrategies', v)} addLabel="Add strategy" />
      </FormSection>
      <FormSection title="Distribution Channels" right={<AIButton loading={ai.loading.distributionChannels} onPress={() => ai.run('distributionChannels', (d) => set('distributionChannels', d))} />}>
        <StringList items={ma.distributionChannels} onChange={(v) => set('distributionChannels', v)} addLabel="Add channel" />
      </FormSection>
    </View>
  );
}

/* --------------------------------------------------------------- 4 Team */
export function TeamStep({ data, update }: StepProps) {
  const staff = data.staff;
  const cur = data.companyInfo.currency || 'USD';
  const fin = data.financial;
  const setRow = (i: number, patch: Partial<(typeof staff)[number]>) => { const a = [...staff]; a[i] = { ...a[i], ...patch }; update('staff', a); };
  const payroll = staff.reduce((s, m) => s + m.salaryPerEmployee * m.count, 0);
  return (
    <View style={{ gap: spacing.lg }}>
      <Callout tone="success">{`Total monthly payroll: ${fmt(payroll)} ${cur} · ${staff.reduce((s, m) => s + m.count, 0)} people`}</Callout>
      {staff.map((m, i) => (
        <ItemCard key={i} title={m.role || `Staff member ${i + 1}`} onRemove={() => update('staff', staff.filter((_, j) => j !== i))}>
          <TextField label="Role / Title" value={m.role} onChangeValue={(v) => setRow(i, { role: v })} placeholder="e.g. Farm Manager" />
          <NumField label="Number of Employees" integer value={m.count} onChange={(v) => setRow(i, { count: v })} />
          <NumField label={`Monthly Salary Per Employee (${cur})`} value={m.salaryPerEmployee} onChange={(v) => setRow(i, { salaryPerEmployee: v })} />
          <TextAreaField label="Responsibilities" value={m.responsibilities} onChangeValue={(v) => setRow(i, { responsibilities: v })} />
        </ItemCard>
      ))}
      <AddRowButton label="Add staff member" onPress={() => update('staff', [...staff, { role: '', count: 1, responsibilities: '', salaryPerEmployee: 0 }])} />
      <FormSection title="Payroll Tax Rates (Pre-configured)">
        <AppText variant="subtitle" style={{ fontSize: 12 }}>
          Pension {(fin.rssbRate * 100).toFixed(1)}% · Health insurance {(fin.healthInsuranceRate * 100).toFixed(1)}% · Other {(fin.maternityRate * 100).toFixed(1)}% of gross salary. Change them in Financial Settings (step 9).
        </AppText>
      </FormSection>
    </View>
  );
}

/* --------------------------------------------------------------- 5 CAPEX */
export function CapexStep({ data, update }: StepProps) {
  const fin = data.financial;
  const cur = data.companyInfo.currency || 'USD';
  const items = fin.capex;
  const setItems = (capex: FinancialData['capex']) => update('financial', { ...fin, capex });
  const total = items.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
  return (
    <View style={{ gap: spacing.lg }}>
      <AppText variant="subtitle" style={{ fontSize: 13 }}>One-time investments in equipment and infrastructure — also the initial investment for NPV, IRR and payback.</AppText>
      <Callout tone="success">{`Total CAPEX (initial investment): ${fmt(total)} ${cur}`}</Callout>
      {items.map((c, i) => (
        <ItemCard key={i} title={c.item || `Item ${i + 1}`} onRemove={() => setItems(items.filter((_, j) => j !== i))}>
          <TextField label="Item" value={c.item} onChangeValue={(v) => { const a = [...items]; a[i] = { ...a[i], item: v }; setItems(a); }} placeholder="e.g. Greenhouse structure" />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}><NumField label="Qty" integer value={c.quantity} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], quantity: v }; setItems(a); }} /></View>
            <View style={{ flex: 2 }}><NumField label={`Cost/Unit (${cur})`} value={c.costPerUnit} onChange={(v) => { const a = [...items]; a[i] = { ...a[i], costPerUnit: v }; setItems(a); }} /></View>
          </View>
          <AppText weight="600" style={{ fontSize: 12, textAlign: 'right' }}>Total: {fmt(c.quantity * c.costPerUnit)} {cur}</AppText>
        </ItemCard>
      ))}
      <AddRowButton label="Add CAPEX item" onPress={() => setItems([...items, { item: '', quantity: 1, costPerUnit: 0 }])} />
    </View>
  );
}

/* ------------------------------------------------------- 6 Products & services */
export function ProductsStep({ data, update }: StepProps) {
  const { colors } = useTheme();
  const fin = data.financial;
  const cur = data.companyInfo.currency || 'USD';
  const [tab, setTab] = useState<'products' | 'services'>(fin.products.length || !fin.services.length ? 'products' : 'services');
  const products = fin.products;
  const services = fin.services;
  const setProducts = (p: FinancialData['products']) => update('financial', { ...fin, products: p });
  const setServices = (s: FinancialData['services']) => update('financial', { ...fin, services: s });

  const Tab = ({ k, label, count }: { k: typeof tab; label: string; count: number }) => (
    <Pressable
      onPress={() => setTab(k)}
      accessibilityRole="tab"
      accessibilityState={{ selected: tab === k }}
      style={{ flex: 1, minHeight: 38, borderRadius: radius.md - 2, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === k ? colors.card : 'transparent' }}
    >
      <AppText weight="600" style={{ fontSize: 13, color: tab === k ? colors.primary : colors.textLight }}>{label}{count ? ` (${count})` : ''}</AppText>
    </Pressable>
  );

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border }}>
        <Tab k="products" label="Products" count={products.length} />
        <Tab k="services" label="Services" count={services.length} />
      </View>

      {tab === 'products' ? (
        <>
          <Callout tone="success">Physical goods your business produces. Each has a bill of materials and a batch size used to calculate the unit manufacturing cost. Leave empty if you only deliver services.</Callout>
          {products.map((p, pi) => {
            const batch = p.components.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
            const unit = p.batchSize > 0 ? batch / p.batchSize : 0;
            const setP = (patch: Partial<typeof p>) => { const a = [...products]; a[pi] = { ...a[pi], ...patch }; setProducts(a); };
            return (
              <ItemCard key={pi} title={`Product ${pi + 1}${p.name ? `: ${p.name}` : ''}`} onRemove={() => setProducts(products.filter((_, j) => j !== pi))}>
                <TextField label="Product Name" required value={p.name} onChangeValue={(v) => setP({ name: v })} placeholder="e.g. Packaged honey 500g" />
                <TextField label="Description" value={p.description} onChangeValue={(v) => setP({ description: v })} />
                <NumField label="Batch Size (units/run)" integer value={p.batchSize} onChange={(v) => setP({ batchSize: v || 1 })} />
                <Grid columns={2} gap={spacing.sm}>
                  <StatTile label="Batch total" value={`${fmt(batch)}`} sub={cur} tone="green" />
                  <StatTile label="Unit cost" value={`${fmt(unit)}`} sub={cur} tone="blue" />
                </Grid>
                <AppText variant="label">Bill of Materials</AppText>
                {p.components.map((c, ci) => {
                  const setC = (patch: Partial<typeof c>) => { const comps = [...p.components]; comps[ci] = { ...comps[ci], ...patch }; setP({ components: comps }); };
                  return (
                    <View key={ci} style={{ gap: 8, padding: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                        <View style={{ flex: 1 }}><TextField label="Component / Material" value={c.item} onChangeValue={(v) => setC({ item: v })} /></View>
                        <Pressable onPress={() => setP({ components: p.components.filter((_, j) => j !== ci) })} hitSlop={6} accessibilityLabel="Remove component" style={{ height: 42, justifyContent: 'center', paddingHorizontal: 6 }}>
                          <AppText weight="700" style={{ color: colors.red }}>✕</AppText>
                        </Pressable>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ flex: 1 }}><NumField label="Qty" value={c.quantity} onChange={(v) => setC({ quantity: v })} /></View>
                        <View style={{ flex: 2 }}><NumField label={`Cost/Unit (${cur})`} value={c.costPerUnit} onChange={(v) => setC({ costPerUnit: v })} /></View>
                      </View>
                    </View>
                  );
                })}
                <AddRowButton label="Add component" onPress={() => setP({ components: [...p.components, { item: '', quantity: 1, costPerUnit: 0 }] })} />
              </ItemCard>
            );
          })}
          <AddRowButton label="Add product" onPress={() => setProducts([...products, { name: '', description: '', batchSize: 100, components: [] }])} />
        </>
      ) : (
        <>
          <Callout tone="info">Intangible services your business delivers (consulting, training, support…). Their pricing and volumes are set in the Revenue Streams step.</Callout>
          {services.map((s, i) => {
            const setS = (patch: Partial<typeof s>) => { const a = [...services]; a[i] = { ...a[i], ...patch }; setServices(a); };
            return (
              <ItemCard key={i} title={`Service ${i + 1}${s.name ? `: ${s.name}` : ''}`} onRemove={() => setServices(services.filter((_, j) => j !== i))}>
                <TextField label="Service Name" required value={s.name} onChangeValue={(v) => setS({ name: v })} placeholder="e.g. Agronomy consulting" />
                <TextAreaField label="Description" value={s.description} onChangeValue={(v) => setS({ description: v })} />
                <SelectField label="Service Type" value={s.serviceType} onChangeValue={(v) => setS({ serviceType: v })} options={[...SERVICE_TYPES]} />
                <SelectField label="Delivery Model" value={s.deliveryModel} onChangeValue={(v) => setS({ deliveryModel: v })} options={[...DELIVERY_MODELS]} />
                <SelectField label="Pricing Model" value={s.pricingModel} onChangeValue={(v) => setS({ pricingModel: v })} options={[...PRICING_MODELS]} />
              </ItemCard>
            );
          })}
          <AddRowButton label="Add service" onPress={() => setServices([...services, { name: '', description: '', serviceType: 'Consulting', deliveryModel: 'On-site', pricingModel: 'Monthly Retainer' }])} />
        </>
      )}
    </View>
  );
}

/* ---------------------------------------------------------------- 7 OPEX */
export function OpexStep({ data, update }: StepProps) {
  const { colors } = useTheme();
  const fin = data.financial;
  const cur = data.companyInfo.currency || 'USD';
  const items = fin.opexItems;
  const setItems = (opexItems: FinancialData['opexItems']) => update('financial', { ...fin, opexItems });
  const monthly = items.reduce((s, o) => s + o.monthlyAmount, 0);
  return (
    <View style={{ gap: spacing.lg }}>
      <Grid columns={2} gap={spacing.sm}>
        <StatTile label="Monthly OPEX" value={fmt(monthly)} sub={cur} tone="green" />
        <StatTile label="Annual OPEX (Y1)" value={fmt(monthly * 12)} sub={cur} tone="blue" />
      </Grid>
      {items.map((o, i) => {
        const setO = (patch: Partial<typeof o>) => { const a = [...items]; a[i] = { ...a[i], ...patch }; setItems(a); };
        return (
          <ItemCard key={i} title={o.item || `Expense ${i + 1}`} onRemove={() => setItems(items.filter((_, j) => j !== i))}>
            <TextField label="Cost Item" value={o.item} onChangeValue={(v) => setO({ item: v })} placeholder="e.g. Fertiliser, Rent, Fuel" />
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <View style={{ flex: 3 }}><NumField label={`Monthly (${cur})`} value={o.monthlyAmount} onChange={(v) => setO({ monthlyAmount: v })} /></View>
              <View style={{ flex: 2 }}><PercentField label="Growth/yr" value={o.growthRate} onChange={(v) => setO({ growthRate: v })} /></View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <AppText variant="label">Variable cost</AppText>
                <AppText variant="caption">Scales with production volume</AppText>
              </View>
              <Switch value={o.isVariable} onValueChange={(v) => setO({ isVariable: v })} trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#fff" />
            </View>
          </ItemCard>
        );
      })}
      <AddRowButton label="Add expense item" onPress={() => setItems([...items, { item: '', monthlyAmount: 0, growthRate: 0, isVariable: false }])} />
    </View>
  );
}

/* -------------------------------------------------------------- 8 Revenue */
const isSale = (p: RevenuePackage) => !!(p.isProductSale || p.isKitSale);

export function RevenueStep({ data, update }: StepProps) {
  const { colors } = useTheme();
  const fin = data.financial;
  const cur = data.companyInfo.currency || 'USD';
  const pkgs = fin.revenuePackages;
  const productNames = fin.products.map((p) => p.name).filter(Boolean);
  const serviceNames = fin.services.map((s) => s.name).filter(Boolean);
  const offerings = [...productNames.map((n) => ({ value: n, label: `${n} (product)` })), ...serviceNames.map((n) => ({ value: n, label: `${n} (service)` }))];
  const setPkgs = (revenuePackages: RevenuePackage[]) => update('financial', { ...fin, revenuePackages });
  const annual = (p: RevenuePackage) => (isSale(p) ? (p.productSellingPrice ?? p.kitSellingPrice ?? 0) * p.annualCustomers : p.pricePerUnitPerMonth * 12 * p.annualCustomers);
  const total = pkgs.reduce((s, p) => s + annual(p), 0);

  return (
    <View style={{ gap: spacing.lg }}>
      <Callout tone="success">{`Year 1 revenue (all streams): ${fmt(total)} ${cur}`}</Callout>
      {pkgs.map((p, i) => {
        const setP = (patch: Partial<RevenuePackage>) => { const a = [...pkgs]; a[i] = { ...a[i], ...patch }; setPkgs(a); };
        const linkedIsService = serviceNames.includes(p.product);
        const sale = isSale(p) && !linkedIsService;
        return (
          <ItemCard key={i} title={p.packageName || p.product || `Revenue stream ${i + 1}`} onRemove={() => setPkgs(pkgs.filter((_, j) => j !== i))}>
            {offerings.length ? (
              <SelectField
                label="Product / Service"
                value={p.product}
                onChangeValue={(v) => setP({ product: v, ...(serviceNames.includes(v) ? { isProductSale: false, isKitSale: false } : null) })}
                options={offerings}
              />
            ) : (
              <TextField label="Product / Service" value={p.product} onChangeValue={(v) => setP({ product: v })} hint="Tip: add products or services in step 6 to pick them here" />
            )}
            <TextField label="Package / Tier Name" value={p.packageName} onChangeValue={(v) => setP({ packageName: v })} placeholder="e.g. Standard, Wholesale" />
            {!linkedIsService ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="label">Product sale (one-time)</AppText>
                  <AppText variant="caption">Priced per unit sold instead of per month</AppText>
                </View>
                <Switch value={isSale(p)} onValueChange={(v) => setP({ isProductSale: v, isKitSale: v })} trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#fff" />
              </View>
            ) : null}
            {sale ? (
              <NumField label={`Selling Price Per Unit (${cur})`} value={p.productSellingPrice ?? p.kitSellingPrice ?? 0} onChange={(v) => setP({ productSellingPrice: v, kitSellingPrice: v })} />
            ) : (
              <NumField label={`Price Per Unit Per Month (${cur})`} value={p.pricePerUnitPerMonth} onChange={(v) => setP({ pricePerUnitPerMonth: v })} />
            )}
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <View style={{ flex: 3 }}><NumField label={sale ? 'Units Sold (Year 1)' : 'Customers (Year 1)'} integer value={p.annualCustomers} onChange={(v) => setP({ annualCustomers: v })} /></View>
              <View style={{ flex: 2 }}><PercentField label="Growth/yr" value={p.growthRate} onChange={(v) => setP({ growthRate: v })} /></View>
            </View>
            <AppText weight="600" style={{ fontSize: 12, textAlign: 'right' }}>Year 1: {fmt(annual(p))} {cur}</AppText>
          </ItemCard>
        );
      })}
      <AddRowButton
        label="Add revenue stream"
        onPress={() => setPkgs([...pkgs, { product: offerings[0]?.value ?? '', packageName: '', pricePerUnitPerMonth: 0, customersPerMonth: 0, annualCustomers: 0, growthRate: 0.1, isProductSale: false, isKitSale: false }])}
      />
    </View>
  );
}

/* --------------------------------------------------- 9 Financial settings */
export function FinanceStep({ data, update }: StepProps) {
  const { columns } = useLayout();
  const fin = data.financial;
  const cur = data.companyInfo.currency || 'USD';
  const setFin = <K extends keyof FinancialData>(k: K, v: FinancialData[K]) => update('financial', { ...fin, [k]: v });
  const setLoan = (patch: Partial<FinancialData['loan']>) => setFin('loan', { ...fin.loan, ...patch });
  const cols = columns >= 2 ? 2 : 1;
  return (
    <View style={{ gap: spacing.lg }}>
      <FormSection title="Commercial Loan">
        <Grid columns={cols} gap={spacing.md}>
          <NumField label={`Loan Amount (${cur})`} value={fin.loan.amount} onChange={(v) => setLoan({ amount: v })} />
          <PercentField label="Annual Interest Rate" value={fin.loan.annualInterestRate} onChange={(v) => setLoan({ annualInterestRate: v })} />
          <NumField label="Loan Term (Years)" integer value={fin.loan.termYears} onChange={(v) => setLoan({ termYears: v || 5 })} />
        </Grid>
      </FormSection>
      <FormSection title="Projection Period">
        <NumField
          label="Number of Projection Years"
          required
          integer
          value={fin.projectionYears ?? 5}
          onChange={(v) => { if (v >= 1) setFin('projectionYears', v); }}
          hint="How many years the projections cover (e.g. 3, 5, 10). Model tables show up to 5 years."
        />
      </FormSection>
      <FormSection title="NPV & Tax">
        <Grid columns={cols} gap={spacing.md}>
          <PercentField label="Discount Rate for NPV & CBA" value={fin.discountRate} onChange={(v) => setFin('discountRate', v)} />
          <PercentField label="Corporate Income Tax (CIT)" value={fin.citRate} onChange={(v) => setFin('citRate', v)} />
        </Grid>
      </FormSection>
      <FormSection title="Payroll Contribution Rates">
        <Grid columns={cols} gap={spacing.md}>
          <PercentField label="Social Security / Pension" value={fin.rssbRate} onChange={(v) => setFin('rssbRate', v)} />
          <PercentField label="Health Insurance" value={fin.healthInsuranceRate} onChange={(v) => setFin('healthInsuranceRate', v)} />
          <PercentField label="Other Payroll Deduction" value={fin.maternityRate} onChange={(v) => setFin('maternityRate', v)} />
        </Grid>
      </FormSection>
      <Callout tone="warning">These were pre-filled from your profile defaults. Changes here apply to this plan only.</Callout>
    </View>
  );
}

/* --------------------------------------------------------------- 10 Review */
export function ReviewStep({ data }: { data: PlanInput }) {
  const { colors } = useTheme();
  const { columns } = useLayout();
  const ci = data.companyInfo;
  const fin = data.financial;
  const cur = ci.currency || 'USD';
  const n = fin.projectionYears ?? 5;
  let results: ReturnType<typeof computeFinancials> | null = null;
  try {
    results = computeFinancials(fin, data.staff);
  } catch {
    results = null;
  }
  if (!results) return <Callout tone="warning">Some figures are incomplete, so the summary can't be computed yet. Check steps 4–9.</Callout>;
  const last = results.totalRevenue.length - 1;

  const items: [string, string][] = [
    ['Company', ci.companyName || '—'],
    ['Product / Project', ci.productName || '—'],
    ['Currency', cur],
    ['Staff', `${data.staff.reduce((s, m) => s + m.count, 0)} people`],
    ['Initial Investment (CAPEX)', `${fmt(results.capexTotal)} ${cur}`],
    ['Annual OPEX (Y1)', `${fmt(results.totalOpex[0] ?? 0)} ${cur}`],
    ['Year 1 Revenue', `${fmt(results.totalRevenue[0] ?? 0)} ${cur}`],
    [`Year ${n} Revenue`, `${fmt(results.totalRevenue[last] ?? 0)} ${cur}`],
    ['Net Income After Tax (Y1)', `${fmt(results.incomeStatement.netIncomeAfterTax[0] ?? 0)} ${cur}`],
    ['Payback Period', results.payback.years > 0 ? `${results.payback.years.toFixed(2)} yrs` : 'N/A'],
    ['IRR', `${(results.npv.irr * 100).toFixed(1)}%`],
    ['NPV Total', `${fmt(results.npv.npvTotal)} ${cur}`],
    [`B/C Ratio (Y${n})`, (results.cba.bcRatio[last] ?? 0).toFixed(2)],
  ];

  const rows: [string, number[]][] = [
    ['Total Revenue', results.totalRevenue],
    ['Total OPEX', results.totalOpex],
    ['Net Income (After Tax)', results.incomeStatement.netIncomeAfterTax],
    ['Cash Balance', results.cashFlow.endingBalance],
  ];

  return (
    <View style={{ gap: spacing.lg }}>
      <AppText variant="subtitle" style={{ fontSize: 13 }}>
        Review the computed summary below, then submit. You can generate your Business Plan (.docx) and Financial Model (.xlsx) from My Business Plans.
      </AppText>
      <FormSection title="Financial Summary Preview">
        <Grid columns={columns >= 2 ? 3 : 2} gap={spacing.sm}>
          {items.map(([k, v]) => (
            <View key={k} style={{ backgroundColor: colors.bg, borderRadius: radius.lg, padding: 12, minHeight: 64 }}>
              <AppText weight="600" style={{ fontSize: 10.5, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.4 }} numberOfLines={2}>{k}</AppText>
              <AppText weight="700" style={{ fontSize: 13, marginTop: 4 }} numberOfLines={2}>{v}</AppText>
            </View>
          ))}
        </Grid>
      </FormSection>
      <FormSection title={`${n}-Year Projection (${cur})`}>
        {rows.map(([label, vals]) => (
          <View key={label} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 12, gap: 6, backgroundColor: colors.card }}>
            <AppText weight="600" style={{ fontSize: 13 }}>{label}</AppText>
            {vals.slice(0, n).map((v, y) => (
              <View key={y} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="caption">Year {y + 1}</AppText>
                <AppText weight="600" style={{ fontSize: 12, color: v < 0 ? colors.red : colors.text }}>{fmt(v)}</AppText>
              </View>
            ))}
          </View>
        ))}
      </FormSection>
    </View>
  );
}
