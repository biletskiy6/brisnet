/**
 * Database Seed Script
 * Populates database with mock data for development and testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@neobrisnet.com' },
    update: {},
    create: {
      email: 'test@neobrisnet.com',
      name: 'Test User',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create tracks
  const tracks = await Promise.all([
    prisma.track.upsert({
      where: { code: 'SAR' },
      update: {},
      create: {
        code: 'SAR',
        name: 'Saratoga',
        location: 'Saratoga Springs, NY',
        raceType: 'Thoroughbred',
        timezone: 'America/New_York',
      },
    }),
    prisma.track.upsert({
      where: { code: 'CD' },
      update: {},
      create: {
        code: 'CD',
        name: 'Churchill Downs',
        location: 'Louisville, KY',
        raceType: 'Thoroughbred',
        timezone: 'America/New_York',
      },
    }),
    prisma.track.upsert({
      where: { code: 'BEL' },
      update: {},
      create: {
        code: 'BEL',
        name: 'Belmont Park',
        location: 'Elmont, NY',
        raceType: 'Thoroughbred',
        timezone: 'America/New_York',
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} tracks`);

  // Create creators
  const creators = await Promise.all([
    prisma.creator.upsert({
      where: { slug: 'bruno-de-julio' },
      update: {},
      create: {
        name: 'Bruno De Julio',
        slug: 'bruno-de-julio',
        bio: 'Expert handicapper with over 20 years of experience in thoroughbred racing.',
        royaltyRate: 15.0,
      },
    }),
    prisma.creator.upsert({
      where: { slug: 'andy-harrington' },
      update: {},
      create: {
        name: 'Andy Harrington',
        slug: 'andy-harrington',
        bio: 'Specializes in exacta and exotic wagers with a focus on value betting.',
        royaltyRate: 12.0,
      },
    }),
    prisma.creator.upsert({
      where: { slug: 'e-ponies' },
      update: {},
      create: {
        name: 'E-Ponies',
        slug: 'e-ponies',
        bio: 'Data-driven handicapping using advanced statistical models.',
        royaltyRate: 10.0,
      },
    }),
  ]);

  console.log(`✅ Created ${creators.length} creators`);

  // Create 10 mock products with dual pricing
  const products = await Promise.all([
    // Product 1: Ultimate Past Performances
    prisma.product.upsert({
      where: { id: 'prod-ult-pp-sar-001' },
      update: {},
      create: {
        id: 'prod-ult-pp-sar-001',
        name: 'Ultimate Past Performances - Saratoga',
        description: 'Complete past performances with speed figures, pace analysis, and TrackMaster ratings for all Saratoga races.',
        contentType: 'pdf',
        cashPrice: 5.99,
        creditPrice: 50,
        thumbnail: '/images/products/ult-pp-sar.jpg',
        downloadUrl: '/files/products/ult-pp-sar.pdf',
        popularity: 150,
        isFeatured: true,
        tags: {
          track: 'SAR',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Past Performance',
          creator: 'Brisnet',
        },
      },
    }),

    // Product 2: Bruno's Power Plays
    prisma.product.upsert({
      where: { id: 'prod-bruno-power-cd-001' },
      update: {},
      create: {
        id: 'prod-bruno-power-cd-001',
        name: "Bruno's Power Plays - Churchill Downs",
        description: 'Expert selections and analysis from Bruno De Julio for today\'s Churchill Downs card.',
        contentType: 'picks',
        cashPrice: 3.99,
        creditPrice: 35,
        thumbnail: '/images/products/bruno-power.jpg',
        downloadUrl: '/files/products/bruno-power-cd.pdf',
        popularity: 220,
        isFeatured: true,
        tags: {
          track: 'CD',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Expert Analysis',
          creator: 'Bruno De Julio',
        },
      },
    }),

    // Product 3: Andy's Easy Exacta
    prisma.product.upsert({
      where: { id: 'prod-andy-exacta-bel-001' },
      update: {},
      create: {
        id: 'prod-andy-exacta-bel-001',
        name: "Andy's Easy Exacta - Belmont",
        description: 'Top exacta combinations with value analysis for every Belmont race.',
        contentType: 'picks',
        cashPrice: 2.99,
        creditPrice: 25,
        thumbnail: '/images/products/andy-exacta.jpg',
        downloadUrl: '/files/products/andy-exacta-bel.pdf',
        popularity: 95,
        isFeatured: false,
        tags: {
          track: 'BEL',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Picks',
          creator: 'Andy Harrington',
        },
      },
    }),

    // Product 4: E-Ponies Speed Figures
    prisma.product.upsert({
      where: { id: 'prod-eponies-speed-001' },
      update: {},
      create: {
        id: 'prod-eponies-speed-001',
        name: 'E-Ponies Speed Figures - All Tracks',
        description: 'Proprietary speed figures and pace projections for all tracks today.',
        contentType: 'csv',
        cashPrice: 7.99,
        creditPrice: 70,
        thumbnail: '/images/products/eponies-speed.jpg',
        downloadUrl: '/files/products/eponies-speed.csv',
        popularity: 180,
        isFeatured: true,
        tags: {
          track: 'ALL',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Speed Figures',
          creator: 'E-Ponies',
        },
      },
    }),

    // Product 5: Classic PPs - Saratoga
    prisma.product.upsert({
      where: { id: 'prod-classic-pp-sar-001' },
      update: {},
      create: {
        id: 'prod-classic-pp-sar-001',
        name: 'Classic Past Performances - Saratoga',
        description: 'Traditional past performance format with essential handicapping data.',
        contentType: 'pdf',
        cashPrice: 3.99,
        creditPrice: 35,
        thumbnail: '/images/products/classic-pp.jpg',
        downloadUrl: '/files/products/classic-pp-sar.pdf',
        popularity: 120,
        isFeatured: false,
        tags: {
          track: 'SAR',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Past Performance',
          creator: 'Brisnet',
        },
      },
    }),

    // Product 6: Workout Report
    prisma.product.upsert({
      where: { id: 'prod-workout-report-001' },
      update: {},
      create: {
        id: 'prod-workout-report-001',
        name: 'Pro Clocker Workout Report - All Tracks',
        description: 'Detailed workout analysis with speed ratings and trainer patterns.',
        contentType: 'pdf',
        cashPrice: 4.99,
        creditPrice: 45,
        thumbnail: '/images/products/workout-report.jpg',
        downloadUrl: '/files/products/workout-report.pdf',
        popularity: 75,
        isFeatured: false,
        tags: {
          track: 'ALL',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Workout Reports',
          creator: 'Brisnet',
        },
      },
    }),

    // Product 7: Pace Projector
    prisma.product.upsert({
      where: { id: 'prod-pace-projector-cd-001' },
      update: {},
      create: {
        id: 'prod-pace-projector-cd-001',
        name: 'Pace Projector - Churchill Downs',
        description: 'Race-by-race pace scenarios showing likely speed duel and closers.',
        contentType: 'pdf',
        cashPrice: 2.49,
        creditPrice: 20,
        thumbnail: '/images/products/pace-projector.jpg',
        downloadUrl: '/files/products/pace-projector-cd.pdf',
        popularity: 110,
        isFeatured: false,
        tags: {
          track: 'CD',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Pace Analysis',
          creator: 'Brisnet',
        },
      },
    }),

    // Product 8: International PPs - UK Racing
    prisma.product.upsert({
      where: { id: 'prod-intl-pp-uk-001' },
      update: {},
      create: {
        id: 'prod-intl-pp-uk-001',
        name: 'International PPs - United Kingdom',
        description: 'Past performances for all UK race meetings with European speed figures.',
        contentType: 'pdf',
        cashPrice: 6.99,
        creditPrice: 60,
        thumbnail: '/images/products/intl-pp-uk.jpg',
        downloadUrl: '/files/products/intl-pp-uk.pdf',
        popularity: 45,
        isFeatured: false,
        tags: {
          track: 'UK',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'International PPs',
          creator: 'E-Ponies',
        },
      },
    }),

    // Product 9: Data Files Package
    prisma.product.upsert({
      where: { id: 'prod-data-files-all-001' },
      update: {},
      create: {
        id: 'prod-data-files-all-001',
        name: 'All-Tracks Data Files Package',
        description: 'Complete DRF and XRD data files for all tracks - perfect for software handicappers.',
        contentType: 'csv',
        cashPrice: 14.99,
        creditPrice: 130,
        thumbnail: '/images/products/data-files.jpg',
        downloadUrl: '/files/products/data-files-all.zip',
        popularity: 85,
        isFeatured: true,
        tags: {
          track: 'ALL',
          date: '2025-12-18',
          raceType: 'Thoroughbred',
          productType: 'Data Files',
          creator: 'Brisnet',
        },
      },
    }),

    // Product 10: Kentucky Derby 152 Special
    prisma.product.upsert({
      where: { id: 'prod-derby-special-001' },
      update: {},
      create: {
        id: 'prod-derby-special-001',
        name: 'Kentucky Derby 152 - Ultimate Package',
        description: 'Complete Derby analysis: PPs, expert picks, pace analysis, and historical trends. Everything you need for the Run for the Roses!',
        contentType: 'pdf',
        cashPrice: 19.99,
        creditPrice: 175,
        thumbnail: '/images/products/derby-special.jpg',
        downloadUrl: '/files/products/derby-special.pdf',
        popularity: 450,
        isFeatured: true,
        tags: {
          track: 'CD',
          date: '2025-05-03',
          raceType: 'Thoroughbred',
          productType: 'Expert Analysis',
          creator: 'Bruno De Julio',
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Give test user some credits
  const creditTransaction = await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      amount: 1250,
      balanceAfter: 1250,
      transactionType: 'bonus',
      referenceId: 'welcome-bonus',
    },
  });

  console.log(`✅ Credited ${creditTransaction.amount} credits to test user`);

  // Add some expiring credits
  const expiringDate = new Date();
  expiringDate.setDate(expiringDate.getDate() + 7);

  await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      amount: 125,
      balanceAfter: 1375,
      transactionType: 'bonus',
      referenceId: 'promo-credits',
      expiresAt: expiringDate,
    },
  });

  console.log(`✅ Added expiring credits`);

  console.log('\n🎉 Database seeded successfully!');
  console.log(`\nTest credentials:`);
  console.log(`Email: ${user.email}`);
  console.log(`User ID: ${user.id}`);
  console.log(`Credit Balance: 1,375 credits (125 expiring in 7 days)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
