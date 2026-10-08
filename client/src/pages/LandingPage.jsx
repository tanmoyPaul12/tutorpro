import React from 'react';
import { 
  Users, Calendar, CheckCircle2, IndianRupee, UserCheck, 
  ArrowRight, Zap, Sparkles, Clock, Award, Star, Check, X
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, onOpenOnboarding, onEnterDemo }) {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ====================================================================
          1. CLEAN, FOCUSED CENTERED HERO (NO BOX ON RIGHT)
          ==================================================================== */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) 16px 50px',
        maxWidth: '1160px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Subtle pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: '#EEEDFE',
          color: '#534AB7',
          border: '1px solid rgba(83, 74, 183, 0.25)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          marginBottom: '20px'
        }}>
          <Sparkles size={14} />
          <span>Tuition & Coaching Management Platform</span>
        </div>

        {/* Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.8rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          marginBottom: '18px',
          color: 'var(--text-primary)'
        }}>
          Run your tuition business,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            not your paperwork.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.98rem, 2vw, 1.22rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '740px',
          margin: '0 auto 28px'
        }}>
          A simple, unified platform to organize student batches, take attendance in 30 seconds, track fee dues with 1-click WhatsApp reminders, and keep parents updated.
        </p>

        {/* Action Buttons */}
        <div className="landing-hero-actions" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={onEnterDemo}
            className="btn btn-primary btn-lg"
            id="hero-live-demo-btn"
            style={{ fontSize: '0.96rem', padding: '13px 24px' }}
          >
            <Zap size={18} />
            <span>⚡ Launch Live Evaluator Demo</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="btn btn-secondary btn-lg"
            id="hero-start-free-btn"
            style={{ fontSize: '0.96rem', padding: '13px 22px' }}
          >
            <span>Start Free Trial</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          marginBottom: '42px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#0F6E56" />
            <span>No credit card required</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#0F6E56" />
            <span>Free tier for up to 15 students</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#0F6E56" />
            <span>Starter plan ₹199/month</span>
          </div>
        </div>

        {/* ====================================================================
            THE 4 CURATED PASTEL WORKFLOW TILES (User-Requested Color Harmony)
            ==================================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '18px',
          textAlign: 'left'
        }}>
          {/* Card 1: Iris / Violet */}
          <div style={{
            background: '#EEEDFE',
            color: '#534AB7',
            border: '1px solid rgba(83, 74, 183, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(83, 74, 183, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Users size={20} color="#534AB7" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: '#534AB7' }}>
                Batch & Student Roster
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#312975' }}>
                Organize Class 9–12 batches, monitor capacity, and store parent phone numbers securely in one directory.
              </p>
            </div>
            <div style={{
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(83, 74, 183, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Active Students</span>
              <span>84 Enrolled</span>
            </div>
          </div>

          {/* Card 2: Mint / Emerald */}
          <div style={{
            background: '#E1F5EE',
            color: '#0F6E56',
            border: '1px solid rgba(15, 110, 86, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(15, 110, 86, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <IndianRupee size={20} color="#0F6E56" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: '#0F6E56' }}>
                Fees & UPI Receipts
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#084838' }}>
                Track collected vs pending fees in real time. Send polite, 1-click WhatsApp reminders with prefilled UPI payment links.
              </p>
            </div>
            <div style={{
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(15, 110, 86, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Monthly Volume</span>
              <span>₹48,500 Collected</span>
            </div>
          </div>

          {/* Card 3: Warm Sand / Amber */}
          <div style={{
            background: '#FAEEDA',
            color: '#854F0B',
            border: '1px solid rgba(133, 79, 11, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(133, 79, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <CheckCircle2 size={20} color="#854F0B" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: '#854F0B' }}>
                1-Click Attendance
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#573305' }}>
                Take daily roll calls in under 30 seconds. Marking a student absent automatically queues an alert for their parents.
              </p>
            </div>
            <div style={{
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(133, 79, 11, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Attendance Rate</span>
              <span>91% Benchmark</span>
            </div>
          </div>

          {/* Card 4: Terracotta / Coral */}
          <div style={{
            background: '#FAECE7',
            color: '#993C1D',
            border: '1px solid rgba(153, 60, 29, 0.2)',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(153, 60, 29, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <UserCheck size={20} color="#993C1D" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: '#993C1D' }}>
                Parent Transparency
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.55, color: '#682611' }}>
                Parents see attendance percentage and payment receipts in their own portal, eliminating repeated phone calls during classes.
              </p>
            </div>
            <div style={{
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(153, 60, 29, 0.2)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Tutor Benefit</span>
              <span>Zero Interrupted Calls</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. THE REAL PROBLEM: THE CHAOS STACK VS. TUTORPRO
          ==================================================================== */}
      <section style={{
        padding: 'clamp(48px, 8vw, 80px) 16px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: '20px',
              background: '#FAEEDA',
              color: '#854F0B',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '14px'
            }}>
              WHY TUTORS SWITCH
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              Still running your coaching on WhatsApp and Excel?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6 }}>
              A single tutor teaching 40 students ends up using 5 disconnected tools every week. It's time-consuming, unorganized, and messy.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '20px'
          }}>
            {/* Problem 1 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#FAECE7',
                color: '#993C1D',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                Paper Registers
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
                Lost Attendance Records
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Registers get misplaced, coffee gets spilled on notebooks, and parents are never informed when a student quietly skips class.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#FAEEDA',
                color: '#854F0B',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                Excel Chasing
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
                Unpaid Fees & Awkward Reminders
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Reconciling UPI screenshots across different bank apps is frustrating. Tutors lose thousands every quarter because they feel awkward asking parents.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#EEEDFE',
                color: '#534AB7',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                WhatsApp Spam
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
                Cluttered Group Chats
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Class timing changes, assignment PDFs, and batch announcements get drowned out in giant WhatsApp groups with 50+ chat messages.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#E1F5EE',
                color: '#0F6E56',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                Phone Interruptions
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>
                Late-Night Inquiries
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Parents calling at 10 PM asking "Sir, is Rohan attending classes regularly?" because there is no transparent portal for them to look at.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. CORE FEATURES SECTION (FOCUSED 6 MODULES)
          ==================================================================== */}
      <section id="features" style={{ padding: 'clamp(48px, 8vw, 85px) 16px', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 14px',
            borderRadius: '20px',
            background: '#EEEDFE',
            color: '#534AB7',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            EVERYTHING YOU NEED
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
            Built around the daily routine of tuition teachers.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Six core modules designed to handle the business and operational side of your academy.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px'
        }}>
          {/* Module 1 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#EEEDFE', color: '#534AB7' }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Student Directory</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Implemented in Starter</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Student profiles, roll numbers, assigned batches, parent contact details, and monthly fee structures.
            </p>
          </div>

          {/* Module 2 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#E1F5EE', color: '#0F6E56' }}>
                <Calendar size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Batches & Scheduling</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Implemented in Starter</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Organize classes by grade and subject (e.g. Class 10 Maths, MWF 4:00 PM). Never face batch schedule conflicts.
            </p>
          </div>

          {/* Module 3 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#FAEEDA', color: '#854F0B' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Attendance System</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Implemented in Starter</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Take roll calls in under 30 seconds. Marking a student absent automatically queues a notification for their parents.
            </p>
          </div>

          {/* Module 4 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#FAECE7', color: '#993C1D' }}>
                <IndianRupee size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Fee Management</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Implemented in Starter</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Track collected vs pending fees per month. Issue payment receipts and dispatch 1-click WhatsApp payment reminders with UPI links.
            </p>
          </div>

          {/* Module 5 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#EEEDFE', color: '#534AB7' }}>
                <Award size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Tests & Results</h3>
                <span style={{ fontSize: '0.72rem', color: '#534AB7', fontWeight: 700 }}>Pro Tier (Preview in Demo)</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Create unit tests, log student marks, and let TutorPro auto-calculate class ranks, percentage brackets, and averages.
            </p>
          </div>

          {/* Module 6 */}
          <div className="card card-hover" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#E1F5EE', color: '#0F6E56' }}>
                <UserCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800 }}>Parent Portal</h3>
                <span style={{ fontSize: '0.72rem', color: '#0F6E56', fontWeight: 700 }}>Dedicated Parent Login</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Parents log in to view their child's attendance rate (e.g. 91%), test scorecards, payment status, and upcoming batches.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. B2B SAAS PRICING (PLAN GATING APPLIED)
          ==================================================================== */}
      <section id="pricing" style={{ padding: 'clamp(48px, 8vw, 85px) 16px', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 14px',
            borderRadius: '20px',
            background: '#E1F5EE',
            color: '#0F6E56',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            B2B SAAS PLANS
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
            Affordable subscriptions for tutors.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Free and Starter tiers are active now. Pro and Institute represent future commercial tiers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          {/* Free Tier */}
          <div className="card" style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>Free Tier</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                ₹0<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                For solo beginner tutors.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px', flex: 1, fontSize: '0.83rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Up to 15 students
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Attendance tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Student directory
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Basic overview
              </li>
            </ul>

            <button onClick={onOpenOnboarding} className="btn btn-secondary" style={{ width: '100%' }}>
              Start Free
            </button>
          </div>

          {/* Starter Tier (Most Popular - Active) */}
          <div className="card" style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid var(--primary)',
            position: 'relative',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '2px 14px',
              borderRadius: '20px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}>
              CURRENT ACTIVE TIER
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Starter Plan</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                ₹199<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                For active tutors with 20–75 students.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px', flex: 1, fontSize: '0.83rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> <strong>Up to 75 students</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Batches & timetable scheduling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Fee tracking & WhatsApp reminders
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> Payment receipts generator
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#0F6E56" /> CSV student data import
              </li>
            </ul>

            <button onClick={onOpenOnboarding} className="btn btn-primary" style={{ width: '100%' }}>
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Pro Tier (Roadmap / Future Scope) */}
          <div className="card" style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px dashed var(--border-strong)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#EEEDFE',
              color: '#534AB7',
              border: '1px solid rgba(83, 74, 183, 0.3)',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.65rem',
              fontWeight: 800
            }}>
              FUTURE SCOPE (ROADMAP)
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span className="badge" style={{ background: '#EEEDFE', color: '#534AB7', marginBottom: '8px' }}>
                Pro Plan
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                ₹599<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                For scaling institutes with multiple teachers.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px', flex: 1, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#534AB7" /> <strong>Up to 300 students</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#534AB7" /> Everything in Starter
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#534AB7" /> Unit tests & auto rankings
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#534AB7" /> Dedicated Parent Portal
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#534AB7" /> Multiple faculty accounts
              </li>
            </ul>

            <button
              onClick={onEnterDemo}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.82rem', borderColor: '#534AB7', color: '#534AB7', background: '#EEEDFE' }}
            >
              ⚡ Preview in Demo Mode
            </button>
          </div>

          {/* Institute Tier (Roadmap / Future Scope) */}
          <div className="card" style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px dashed var(--border-strong)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-surface-hover)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.65rem',
              fontWeight: 800
            }}>
              FUTURE SCOPE (ROADMAP)
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>Institute Plan</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                ₹1,499<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/month</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                For multi-branch coaching centres.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px', flex: 1, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--text-muted)" /> <strong>Up to 1,000 students</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--text-muted)" /> Multi-branch branch management
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--text-muted)" /> Custom branded academy app
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="var(--text-muted)" /> Dedicated priority support
              </li>
            </ul>

            <button
              disabled
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.82rem', opacity: 0.6, cursor: 'not-allowed' }}
            >
              Roadmap Tier
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. FUTURE SCOPE: THE TUTOR MARKETPLACE & AI ROADMAP
          ==================================================================== */}
      <section id="marketplace" style={{
        padding: 'clamp(48px, 8vw, 85px) 16px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: '20px',
              background: '#EEEDFE',
              color: '#534AB7',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '12px'
            }}>
              COLLEGE PRESENTATION SLIDE HIGHLIGHT
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '14px' }}>
              Future Scope: Tutor Marketplace & AI Roadmap
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Beyond tuition management: expanding into a two-sided marketplace where tutors acquire students and TutorPro monetizes via a 5% transaction commission.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Left: Two Revenue Streams */}
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
                Dual Revenue Engines
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                TutorPro begins as an operating SaaS (₹199/mo). In Phase 2, tutors publish verified public profiles. Parents discover tutors, book demo classes, and TutorPro earns a commission.
              </p>

              <div style={{
                background: 'var(--bg-app)',
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Stream 1: SaaS Subscription</span>
                  <span className="badge badge-primary">₹199 / month</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Stream 2: Marketplace Commission</span>
                  <span className="badge badge-success">5% per booked student</span>
                </div>
              </div>

              {/* Phased Roadmap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#0F6E56', fontWeight: 800 }}>✓ Phase 1 (Today):</span>
                  <span>Tutor Operating System (Students, Batches, Attendance, Fees)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#534AB7', fontWeight: 800 }}>⏳ Phase 2:</span>
                  <span>Tutor Marketplace & Public Demo Booking (5% commission)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#854F0B', fontWeight: 800 }}>🚀 Phase 3:</span>
                  <span>AI Question Paper Generator & Multi-City Expansion</span>
                </div>
              </div>
            </div>

            {/* Right: Public Tutor Profile Mockup Card */}
            <div>
              <div className="card" style={{
                maxWidth: '400px',
                margin: '0 auto',
                padding: '26px',
                border: '1px solid rgba(83, 74, 183, 0.3)',
                borderRadius: '18px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: '#EEEDFE',
                    color: '#534AB7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem'
                  }}>
                    👨‍🏫
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Rahul Sharma</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Mathematics Specialist</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#854F0B', fontSize: '0.82rem', fontWeight: 700 }}>
                        <Star size={13} fill="#854F0B" /> 4.8
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>(42 reviews)</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  padding: '12px',
                  background: 'var(--bg-surface-hover)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Experience</div>
                    <div style={{ fontWeight: 700 }}>5 Years</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Students Taught</div>
                    <div style={{ fontWeight: 700 }}>120+ Students</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Grades</div>
                    <div style={{ fontWeight: 700 }}>Class 8–12</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Focus</div>
                    <div style={{ fontWeight: 700 }}>JEE & Boards</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tuition Rate</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹500 <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>/ class</span>
                    </div>
                  </div>
                  <span className="badge" style={{ background: '#E1F5EE', color: '#0F6E56', fontWeight: 700, fontSize: '0.72rem' }}>
                    Demo Available
                  </span>
                </div>

                <button
                  onClick={() => alert('Future Scope Demo: Booking demo class with Rahul Sharma! TutorPro earns ₹25 (5% commission).')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '11px', fontSize: '0.88rem' }}
                >
                  Book Demo Class
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. FOOTER
          ==================================================================== */}
      <footer style={{
        padding: '40px 16px 25px',
        maxWidth: '1160px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>🎓</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>TutorPro</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>— Run your tuition business, not your paperwork.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#marketplace">Marketplace</a>
            <button onClick={onEnterDemo} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Launch Live Demo
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div>© 2026 TutorPro Inc. All rights reserved. Built with MERN Stack.</div>
          
        </div>
      </footer>
    </div>
  );
}
