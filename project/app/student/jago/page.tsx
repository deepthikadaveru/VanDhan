'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Send, Sparkles, Bot, User as UserIcon, LifeBuoy, Phone, ArrowRight } from 'lucide-react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const QUICK_CHIPS = [
  'Check my status',
  'Missing documents',
  'Payment update',
  'Find scholarships',
  'Create grievance',
];

function generateResponse(input: string): { content: string; actions?: { label: string; url: string }[] } {
  const lower = input.toLowerCase();

  if (lower.includes('pending') || lower.includes('status') || lower.includes('why') || lower.includes('check my status')) {
    return {
      content: "Your Post-Matric Scholarship application (MOTA-PMS-2026-00124) is currently at Institution Verification. Your income certificate needs renewal, and the institution needs to confirm your enrolment. You can resolve the certificate issue now.",
      actions: [{ label: 'Resolve deficiency', url: '/student/deficiencies/MOTA-PMS-2026-00124' }],
    };
  }

  if (lower.includes('document') || lower.includes('missing') || lower.includes('what documents')) {
    return {
      content: "Your Post-Matric application requires: ST certificate, income certificate, academic marksheet, bonafide certificate and bank proof. Your income certificate and bonafide certificate need attention.",
      actions: [{ label: 'Go to Document Wallet', url: '/student/wallet' }],
    };
  }

  if (lower.includes('payment') || lower.includes('credited') || lower.includes('money') || lower.includes('dbt')) {
    return {
      content: "Your Pre-Matric Scholarship payment of ₹12,000 was credited on 18 August 2026. Your Post-Matric payment is not yet initiated because verification is still in progress.",
      actions: [{ label: 'Track Payments', url: '/student/payments' }],
    };
  }

  if (lower.includes('eligible') || lower.includes('eligibility') || lower.includes('top class') || lower.includes('find scholarship')) {
    return {
      content: "You may be eligible for the Top Class Education Scholarship if you are admitted to a notified institution and your verified family income meets the applicable criteria. Let's check your eligibility.",
      actions: [{ label: 'Check eligibility', url: '/student/eligibility' }],
    };
  }

  if (lower.includes('grievance') || lower.includes('complaint') || lower.includes('help') || lower.includes('create grievance')) {
    return {
      content: "I can create a grievance ticket or request a callback from the scholarship helpdesk.",
      actions: [
        { label: 'Create grievance', url: '/student/grievances' },
        { label: 'Request callback', url: '#' },
      ],
    };
  }

  if (lower.includes('conflict') || lower.includes('overlap')) {
    return {
      content: "An active scholarship record may overlap with a new application. Your case requires policy review before a new benefit can be sanctioned. I cannot confirm this automatically — I can help you create a review request for a scholarship officer.",
      actions: [{ label: 'Request Policy Review', url: '/student/eligibility' }],
    };
  }

  if (lower.includes('consent') || lower.includes('privacy') || lower.includes('data')) {
    return {
      content: "Your data is accessed only for scholarship services you approve. You can view and revoke your consents at any time from the Consent Management page.",
      actions: [{ label: 'Manage Consents', url: '/student/consents' }],
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste')) {
    return {
      content: "Namaste! I'm JAGO, your scholarship guide. I can help you with checking application status, required documents, payment updates, eligibility, and grievances. What would you like to know?",
    };
  }

  return {
    content: "I cannot confirm this automatically. I can help you create a review request for a scholarship officer, or you can ask me about your application status, documents, payments, or eligibility.",
    actions: [{ label: 'Create grievance', url: '/student/grievances' }],
  };
}

export default function JagoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'bot',
      content: "Namaste, Asha! I'm JAGO — your scholarship guide. I can help you with your applications, documents, payments, eligibility and more. How can I help you today?",
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(text);
      const botMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'bot',
        content: response.content,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 800);
  };

  return (
    <StudentLayout>
      <PageHeader
        title="JAGO — Your Scholarship Guide"
        description="Ask me anything about your scholarships, applications, documents or payments"
      />

      <div className="max-w-2xl mx-auto">
        {/* Chat Container */}
        <Card className="h-[60vh] flex flex-col">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2.5', msg.role === 'user' && 'flex-row-reverse')}>
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0',
                  msg.role === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {msg.role === 'bot' ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className={cn('max-w-[80%]', msg.role === 'user' && 'text-right')}>
                  <div className={cn(
                    'inline-block rounded-2xl px-4 py-2.5 text-sm',
                    msg.role === 'bot'
                      ? 'bg-primary/5 border border-primary/10 rounded-tl-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  )}>
                    {msg.content}
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.actions.map((action, i) => (
                        <Link key={i} href={action.url}>
                          <Button size="sm" variant="outline" className="text-xs gap-1">
                            {action.label}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="inline-block rounded-2xl px-4 py-3 bg-primary/5 border border-primary/10">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Chips */}
          <div className="border-t p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask JAGO a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Guardrail Note */}
        <div className="mt-3 rounded-lg border border-info/20 bg-info/5 p-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            JAGO uses rule-based responses from your mock student data. JAGO will never invent a policy decision. If a question cannot be answered, JAGO will offer to create a review request.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
