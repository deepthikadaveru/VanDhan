'use client';

import { useState } from 'react';
import { Settings, History, FileEdit, Send } from 'lucide-react';
import { OfficerLayout } from '@/components/layout/officer-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/page-header';
import { SCHEME_RULE_VERSIONS, SCHEMES } from '@/lib/mock-data/schemes';
import type { SchemeCode } from '@/types';
import { toast } from 'sonner';

export default function SchemeRulesPage() {
  const [selectedScheme, setSelectedScheme] = useState<SchemeCode>('POST_MATRIC');
  const [draftMode, setDraftMode] = useState(false);
  const ruleVersion = SCHEME_RULE_VERSIONS.find((r) => r.schemeCode === selectedScheme);
  const scheme = SCHEMES.find((s) => s.code === selectedScheme);

  const handlePublish = () => {
    setDraftMode(false);
    toast.success('Rule version published', { description: 'New rule version has been published and is now active.' });
  };

  return (
    <OfficerLayout>
      <PageHeader
        title="Scheme Rules"
        description="Configurable policy rules for each scholarship scheme"
        right={
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDraftMode(!draftMode)}>
            <FileEdit className="h-4 w-4" />
            {draftMode ? 'Cancel Draft' : 'Draft Change'}
          </Button>
        }
      />

      <Tabs value={selectedScheme} onValueChange={(v) => setSelectedScheme(v as SchemeCode)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4">
          {SCHEMES.map((s) => (
            <TabsTrigger key={s.code} value={s.code} className="text-xs">{s.shortName}</TabsTrigger>
          ))}
        </TabsList>

        {SCHEMES.map((s) => (
          <TabsContent key={s.code} value={s.code}>
            {ruleVersion && (
              <div className="space-y-4">
                {/* Version Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Version {ruleVersion.version}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${ruleVersion.status === 'PUBLISHED' ? 'border-success/30 text-success' : 'border-warning/30 text-warning'}`}>
                      {ruleVersion.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Published {ruleVersion.publishedDate}</span>
                  </div>
                </div>

                {/* Rule Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ruleVersion.rules.map((rule, i) => (
                    <Card key={i} className={draftMode ? 'border-warning/30' : ''}>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{rule.label}</p>
                        {draftMode ? (
                          <input
                            type="text"
                            defaultValue={rule.value}
                            className="flex h-9 w-full rounded-md border border-warning/30 bg-warning/5 px-3 text-sm font-medium"
                          />
                        ) : (
                          <p className="text-sm font-medium">{rule.value}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Draft Actions */}
                {draftMode && (
                  <Card className="border-warning/30 bg-warning/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-warning">Draft Changes in Progress</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Changes will be reviewed before publishing a new rule version.</p>
                        </div>
                        <Button size="sm" className="gap-1.5" onClick={handlePublish}>
                          <Send className="h-4 w-4" />
                          Publish Rule Version
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Version History */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Version History</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {[
                      { version: ruleVersion.version, date: ruleVersion.publishedDate, status: 'PUBLISHED', note: 'Current version' },
                      { version: 'v' + (parseFloat(ruleVersion.version.slice(1)) - 0.1).toFixed(1), date: '01 Apr 2025', status: 'ARCHIVED', note: 'Previous version — income threshold was ₹2,00,000' },
                      { version: 'v' + (parseFloat(ruleVersion.version.slice(1)) - 0.2).toFixed(1), date: '15 Mar 2024', status: 'ARCHIVED', note: 'Initial published version' },
                    ].map((v, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div>
                          <span className="font-mono font-medium">{v.version}</span>
                          <span className="text-xs text-muted-foreground ml-2">{v.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{v.note}</span>
                          <Badge variant="outline" className={`text-xs ${v.status === 'PUBLISHED' ? 'border-success/30 text-success' : 'border-border text-muted-foreground'}`}>
                            {v.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </OfficerLayout>
  );
}
