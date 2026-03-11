import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample talent user
  const talentUser = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {},
    create: {
      userId: 'sample-talent-1',
      email: 'player@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      dateOfBirth: '2000-05-15',
      nationality: 'United States',
      phone: '+1234567890',
      languages: ['English'],
      currentLocation: 'Los Angeles, CA',
      registrationStatus: 'COMPLETE',
      userType: 'TALENT',
      playingStatus: 'PLAYING',
      experienceLevel: 'ACADEMY',
      position: 'MIDFIELDER',
      currentClub: 'LA Galaxy Academy',
      preferredFoot: 'RIGHT',
    },
  });

  // Create physical attributes for talent
  await prisma.physicalAttributes.upsert({
    where: { userId: talentUser.userId },
    update: {},
    create: {
      userId: talentUser.userId,
      height: 178,
      weight: 72,
      wingspan: 183,
      fitnessLevel: 85,
      preferredFoot: 'RIGHT',
    },
  });

  // Create football profile for talent
  await prisma.footballProfile.upsert({
    where: { userId: talentUser.userId },
    update: {},
    create: {
      userId: talentUser.userId,
      primaryPosition: 'Central Midfielder',
      secondaryPositions: ['Attacking Midfielder', 'Defensive Midfielder'],
      currentClub: 'LA Galaxy Academy',
      previousClubs: ['Youth FC', 'Academy Stars'],
      playingStyle: ['Technical', 'Playmaker', 'Box-to-box'],
      strongFoot: 'RIGHT',
      experience: 'ACADEMY',
    },
  });

  // Create scout user
  const scoutUser = await prisma.user.upsert({
    where: { email: 'scout@example.com' },
    update: {},
    create: {
      userId: 'sample-scout-1',
      email: 'scout@example.com',
      firstName: 'Sarah',
      lastName: 'Smith',
      fullName: 'Sarah Smith',
      nationality: 'United Kingdom',
      phone: '+441234567890',
      languages: ['English', 'Spanish'],
      currentLocation: 'London, UK',
      registrationStatus: 'COMPLETE',
      userType: 'AGENT',
      agencyName: 'Elite Talent Agency',
      yearsExperience: 8,
      specialties: ['Youth Development', 'European Markets'],
      professionalFocus: 'TALENT_DISCOVERY',
    },
  });

  // Create club user
  const clubUser = await prisma.user.upsert({
    where: { email: 'club@example.com' },
    update: {},
    create: {
      userId: 'sample-club-1',
      email: 'club@example.com',
      firstName: 'Michael',
      lastName: 'Johnson',
      fullName: 'Michael Johnson',
      nationality: 'Spain',
      phone: '+34123456789',
      languages: ['English', 'Spanish'],
      currentLocation: 'Barcelona, Spain',
      registrationStatus: 'COMPLETE',
      userType: 'CLUB',
      clubName: 'FC Barcelona',
      clubRole: 'Head Scout',
      department: 'Scouting & Analysis',
      professionalFocus: 'TALENT_DISCOVERY',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created users:
  - Talent: ${talentUser.email}
  - Scout: ${scoutUser.email}
  - Club: ${clubUser.email}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
