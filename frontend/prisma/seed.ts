// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate random scores
function getRandomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random name
function generateName(): string {
  const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Rohan', 'Krishna', 'Dev',
    'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kiara', 'Navya', 'Priya', 'Riya',
    'Kabir', 'Ishaan', 'Reyansh', 'Ayaan', 'Vihaan', 'Arnav', 'Advait', 'Dhruv',
    'Isha', 'Myra', 'Anika', 'Avni', 'Kavya', 'Neha', 'Shreya', 'Tara'
  ];
  const lastNames = [
    'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Joshi',
    'Rao', 'Iyer', 'Menon', 'Nair', 'Desai', 'Pandey', 'Mishra', 'Agarwal',
    'Chopra', 'Malhotra', 'Mehta', 'Shah', 'Kapoor', 'Bose', 'Das', 'Roy'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate roll number format
function generateUID(index: number): string {
  return `UID${String(index).padStart(6, '0')}`;
}

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Hostels (1-21)
  console.log('📦 Creating hostels...');
  const hostelNames = [
    'Aravali', 'Nilgiri', 'Vindhya', 'Satpura', 'Karakoram',
    'Shivalik', 'Kumaon', 'Himadri', 'Kailash', 'Jwalamukhi',
    'Girnar', 'Udaigiri', 'Zanskar', 'Mahanadi', 'Brahmaputra',
    'Ganga', 'Yamuna', 'Narmada', 'Kaveri', 'Godavari', 'Krishna'
  ];

  for (let i = 0; i < 21; i++) {
    await prisma.hostels.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1,
        name: hostelNames[i]
      }
    });
  }
  console.log('✅ Created 21 hostels');

  // 2. Create Users (500 students distributed across hostels)
  console.log('👥 Creating users...');
  const totalUsers = 500;
  const users = [];

  for (let i = 1; i <= totalUsers; i++) {
    // Random hostel assignment (1-21)
    const hostelId = Math.floor(Math.random() * 21) + 1;
    
    // Generate scores with some variation
    // Some students are good at specific games, some are all-rounders
    const studentType = Math.random();
    let scores: number[];

    if (studentType < 0.3) {
      // 30% - Specialist (very good at 1-2 games)
      const specialGame = Math.floor(Math.random() * 5);
      scores = [0, 0, 0, 0, 0];
      scores[specialGame] = getRandomScore(800, 1500);
      if (Math.random() > 0.5) {
        const secondGame = (specialGame + 1) % 5;
        scores[secondGame] = getRandomScore(500, 1000);
      }
    } else if (studentType < 0.6) {
      // 30% - All-rounder (decent at all games)
      scores = [
        getRandomScore(300, 700),
        getRandomScore(300, 700),
        getRandomScore(300, 700),
        getRandomScore(300, 700),
        getRandomScore(300, 700)
      ];
    } else if (studentType < 0.85) {
      // 25% - Average player (mix of scores)
      scores = [
        getRandomScore(100, 500),
        getRandomScore(100, 500),
        getRandomScore(100, 500),
        getRandomScore(100, 500),
        getRandomScore(100, 500)
      ];
    } else {
      // 15% - Casual player (low scores or zeros)
      scores = [
        getRandomScore(0, 200),
        getRandomScore(0, 200),
        getRandomScore(0, 200),
        getRandomScore(0, 200),
        getRandomScore(0, 200)
      ];
    }

    users.push({
      uid: generateUID(i),
      name: generateName(),
      hostel_id: hostelId,
      bestScore1: scores[0],
      bestScore2: scores[1],
      bestScore3: scores[2],
      bestScore4: scores[3],
      bestScore5: scores[4]
    });
  }

  // Bulk insert users
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  });
  console.log(`✅ Created ${totalUsers} users`);

  // 3. Create StudentHostels entries (email mapping)
  console.log('📧 Creating student hostel mappings...');
  const studentHostels = users.map((user, index) => ({
    email: `student${index + 1}@college.edu`,
    hostel_id: user.hostel_id
  }));

  await prisma.studentHostels.createMany({
    data: studentHostels,
    skipDuplicates: true
  });
  console.log(`✅ Created ${studentHostels.length} student-hostel mappings`);

  // 4. Display summary statistics
  console.log('\n📊 Database Summary:');
  
  const hostelCount = await prisma.hostels.count();
  const userCount = await prisma.user.count();
  const studentHostelCount = await prisma.studentHostels.count();
  
  console.log(`   Hostels: ${hostelCount}`);
  console.log(`   Users: ${userCount}`);
  console.log(`   Student-Hostel Mappings: ${studentHostelCount}`);

  // Display top scorer for each game
  console.log('\n🏆 Top Scorers:');
  for (let gameNum = 1; gameNum <= 5; gameNum++) {
    const scoreField = `bestScore${gameNum}` as keyof typeof prisma.user.fields;
    const topPlayer = await prisma.user.findFirst({
      orderBy: { [scoreField]: 'desc' },
      select: {
        name: true,
        hostel_id: true,
        [scoreField]: true
      }
    });
    
    if (topPlayer) {
      const hostel = await prisma.hostels.findUnique({
        where: { id: topPlayer.hostel_id || 0 }
      });
      console.log(`   Game ${gameNum}: ${topPlayer.name} (${hostel?.name}) - ${topPlayer[scoreField]} points`);
    }
  }

  // Display hostel with most participants
  console.log('\n👥 Hostel Participation:');
  const hostelStats = await prisma.$queryRaw<Array<{hostel_id: number, count: bigint}>>`
    SELECT hostel_id, COUNT(*) as count
    FROM "User"
    WHERE hostel_id IS NOT NULL
    GROUP BY hostel_id
    ORDER BY count DESC
    LIMIT 5
  `;
  
  for (const stat of hostelStats) {
    const hostel = await prisma.hostels.findUnique({
      where: { id: stat.hostel_id }
    });
    console.log(`   ${hostel?.name}: ${stat.count} participants`);
  }

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });