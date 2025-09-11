import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Seed the database with sample data
 * This script creates initial users, campaigns, and other test data
 */
async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@globaladslaunch.com' },
    update: {},
    create: {
      email: 'admin@globaladslaunch.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      company: 'Global Ads Launch',
      phone: '+1-555-0123',
      timezone: 'America/New_York',
      subscription: {
        create: {
          planId: 'enterprise',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'demo@globaladslaunch.com' },
    update: {},
    create: {
      email: 'demo@globaladslaunch.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      company: 'Demo Company',
      phone: '+1-555-0456',
      timezone: 'America/Los_Angeles',
      subscription: {
        create: {
          planId: 'professional',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }
  })

  console.log('✅ Users created:', { user1: user1.email, user2: user2.email })

  // Create sample campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      userId: user1.id,
      name: 'Summer Sale Campaign',
      platform: 'google',
      status: 'active',
      budget: 5000,
      targetAudience: {
        ageRange: [25, 45],
        interests: ['technology', 'shopping'],
        locations: ['United States', 'Canada'],
        languages: ['English']
      },
      keywords: ['summer sale', 'discount', 'technology deals', 'online shopping'],
      adGroups: [
        {
          name: 'Electronics',
          keywords: ['laptop', 'smartphone', 'tablet'],
          ads: [
            {
              headline: 'Summer Electronics Sale',
              description: 'Up to 50% off on all electronics',
              finalUrl: 'https://example.com/electronics'
            }
          ]
        }
      ],
      settings: {
        biddingStrategy: 'target_cpa',
        targetCpa: 10.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      userId: user1.id,
      name: 'B2B Lead Generation',
      platform: 'microsoft',
      status: 'active',
      budget: 3000,
      targetAudience: {
        ageRange: [30, 55],
        interests: ['business', 'software'],
        locations: ['United States'],
        languages: ['English']
      },
      keywords: ['business software', 'enterprise solutions', 'B2B tools'],
      adGroups: [
        {
          name: 'Software Solutions',
          keywords: ['CRM', 'ERP', 'business automation'],
          ads: [
            {
              headline: 'Enterprise Software Solutions',
              description: 'Streamline your business operations',
              finalUrl: 'https://example.com/enterprise'
            }
          ]
        }
      ],
      settings: {
        biddingStrategy: 'target_cpa',
        targetCpa: 25.00,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const campaign3 = await prisma.campaign.create({
    data: {
      userId: user2.id,
      name: 'YouTube Brand Awareness',
      platform: 'youtube',
      status: 'draft',
      budget: 2000,
      targetAudience: {
        ageRange: [18, 35],
        interests: ['entertainment', 'lifestyle'],
        locations: ['United States', 'United Kingdom'],
        languages: ['English']
      },
      keywords: ['lifestyle', 'entertainment', 'viral content'],
      adGroups: [
        {
          name: 'Lifestyle Content',
          keywords: ['fashion', 'beauty', 'lifestyle'],
          ads: [
            {
              headline: 'Discover Your Style',
              description: 'Find the perfect look for every occasion',
              finalUrl: 'https://example.com/lifestyle'
            }
          ]
        }
      ],
      settings: {
        biddingStrategy: 'target_cpa',
        targetCpa: 5.00,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
      }
    }
  })

  console.log('✅ Campaigns created:', { 
    campaign1: campaign1.name, 
    campaign2: campaign2.name, 
    campaign3: campaign3.name 
  })

  // Create sample performance data
  const performanceData = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    
    // Campaign 1 performance
    performanceData.push({
      campaignId: campaign1.id,
      date,
      impressions: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 500) + 50,
      spend: Math.random() * 200 + 50,
      conversions: Math.floor(Math.random() * 20) + 1,
      conversionsValue: Math.random() * 1000 + 100,
      ctr: Math.random() * 0.05 + 0.02,
      cpc: Math.random() * 2 + 0.5,
      cpm: Math.random() * 10 + 5,
      roas: Math.random() * 3 + 1
    })

    // Campaign 2 performance
    performanceData.push({
      campaignId: campaign2.id,
      date,
      impressions: Math.floor(Math.random() * 5000) + 500,
      clicks: Math.floor(Math.random() * 200) + 20,
      spend: Math.random() * 100 + 25,
      conversions: Math.floor(Math.random() * 10) + 1,
      conversionsValue: Math.random() * 500 + 50,
      ctr: Math.random() * 0.04 + 0.01,
      cpc: Math.random() * 3 + 1,
      cpm: Math.random() * 15 + 8,
      roas: Math.random() * 2 + 0.5
    })
  }

  await prisma.campaignPerformance.createMany({
    data: performanceData
  })

  console.log('✅ Performance data created:', performanceData.length, 'records')

  // Create sample integrations
  await prisma.integration.createMany({
    data: [
      {
        userId: user1.id,
        platform: 'google',
        type: 'ads',
        credentials: { encrypted: true },
        status: 'active',
        lastSync: new Date()
      },
      {
        userId: user1.id,
        platform: 'microsoft',
        type: 'ads',
        credentials: { encrypted: true },
        status: 'active',
        lastSync: new Date()
      },
      {
        userId: user2.id,
        platform: 'google',
        type: 'ads',
        credentials: { encrypted: true },
        status: 'inactive',
        lastSync: null
      }
    ]
  })

  console.log('✅ Integrations created')

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: 'alert',
        title: 'Campaign Performance Alert',
        message: 'Your Summer Sale Campaign has exceeded the daily budget limit.',
        data: { campaignId: campaign1.id, alertType: 'budget_exceeded' }
      },
      {
        userId: user1.id,
        type: 'report',
        title: 'Weekly Performance Report',
        message: 'Your campaigns performed 15% better than last week.',
        data: { reportType: 'weekly', improvement: 15 }
      },
      {
        userId: user2.id,
        type: 'system',
        title: 'Welcome to Global Ads Launch',
        message: 'Get started by creating your first campaign.',
        data: { action: 'create_campaign' }
      }
    ]
  })

  console.log('✅ Notifications created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })







