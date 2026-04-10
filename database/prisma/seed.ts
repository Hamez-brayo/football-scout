import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const playerUser = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {
      role: 'PLAYER',
      registrationStatus: 'COMPLETE',
    },
    create: {
      userId: 'sample-player-1',
      email: 'player@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-05-15T00:00:00.000Z'),
      nationality: 'Kenya',
      phone: '+254700000001',
      currentLocation: 'Nairobi',
      role: 'PLAYER',
      registrationStatus: 'COMPLETE',
    },
  });

  const scoutUser = await prisma.user.upsert({
    where: { email: 'scout@example.com' },
    update: {
      role: 'SCOUT',
      registrationStatus: 'COMPLETE',
    },
    create: {
      userId: 'sample-scout-1',
      email: 'scout@example.com',
      firstName: 'Sarah',
      lastName: 'Smith',
      fullName: 'Sarah Smith',
      nationality: 'United Kingdom',
      phone: '+447000000001',
      currentLocation: 'London',
      role: 'SCOUT',
      registrationStatus: 'COMPLETE',
    },
  });

  const playerProfile = await prisma.playerProfile.upsert({
    where: { userId: playerUser.userId },
    update: {
      primaryPosition: 'MIDFIELDER',
      secondaryPositions: ['DEFENSIVE_MIDFIELDER'],
      currentClub: 'Nairobi Academy FC',
      preferredFoot: 'RIGHT',
      experienceLevel: 'ACADEMY',
      isAvailable: true,
      bio: 'Box-to-box midfielder with strong passing range.',
    },
    create: {
      userId: playerUser.userId,
      primaryPosition: 'MIDFIELDER',
      secondaryPositions: ['DEFENSIVE_MIDFIELDER'],
      currentClub: 'Nairobi Academy FC',
      preferredFoot: 'RIGHT',
      experienceLevel: 'ACADEMY',
      isAvailable: true,
      bio: 'Box-to-box midfielder with strong passing range.',
    },
  });

  await prisma.physicalAttributes.upsert({
    where: { playerProfileId: playerProfile.id },
    update: {
      heightCm: 178,
      weightKg: 72,
      wingspanCm: 182,
      sprintSpeed: 7.2,
      staminaScore: 84,
    },
    create: {
      playerProfileId: playerProfile.id,
      heightCm: 178,
      weightKg: 72,
      wingspanCm: 182,
      sprintSpeed: 7.2,
      staminaScore: 84,
    },
  });

  const footballProfile = await prisma.footballProfile.upsert({
    where: { playerProfileId: playerProfile.id },
    update: {
      dominantFoot: 'RIGHT',
      playingStyle: ['TECHNICAL', 'TRANSITION'],
      strongestSkills: ['PASSING', 'BALL_RETENTION'],
      weakFootRating: 3,
    },
    create: {
      playerProfileId: playerProfile.id,
      dominantFoot: 'RIGHT',
      playingStyle: ['TECHNICAL', 'TRANSITION'],
      strongestSkills: ['PASSING', 'BALL_RETENTION'],
      weakFootRating: 3,
    },
  });

  await prisma.achievement.upsert({
    where: {
      id: 'seed-achievement-1',
    },
    update: {
      title: 'Regional Youth Cup Winner',
      description: 'Won regional youth tournament in 2024',
      date: new Date('2024-08-10T00:00:00.000Z'),
      footballProfileId: footballProfile.id,
    },
    create: {
      id: 'seed-achievement-1',
      footballProfileId: footballProfile.id,
      title: 'Regional Youth Cup Winner',
      description: 'Won regional youth tournament in 2024',
      date: new Date('2024-08-10T00:00:00.000Z'),
    },
  });

  await prisma.media.upsert({
    where: { id: 'seed-media-1' },
    update: {
      userId: playerUser.userId,
      type: 'VIDEO',
      status: 'READY',
      url: 'https://example.com/media/highlight-1.mp4',
      thumbnailUrl: 'https://example.com/media/highlight-1.jpg',
      mimeType: 'video/mp4',
      sizeBytes: 52428800,
      durationSec: 95,
      title: 'Match Highlight Reel',
      description: 'Recent matches and passing highlights.',
    },
    create: {
      id: 'seed-media-1',
      userId: playerUser.userId,
      type: 'VIDEO',
      status: 'READY',
      url: 'https://example.com/media/highlight-1.mp4',
      thumbnailUrl: 'https://example.com/media/highlight-1.jpg',
      mimeType: 'video/mp4',
      sizeBytes: 52428800,
      durationSec: 95,
      title: 'Match Highlight Reel',
      description: 'Recent matches and passing highlights.',
    },
  });

  const program = await prisma.trainingProgram.upsert({
    where: { id: 'seed-program-1' },
    update: {
      title: 'Midfield Progression Plan',
      level: 'INTERMEDIATE',
      positionFocus: 'MIDFIELDER',
      description: 'Progressive plan for composure and transition play.',
      createdById: scoutUser.userId,
    },
    create: {
      id: 'seed-program-1',
      title: 'Midfield Progression Plan',
      level: 'INTERMEDIATE',
      positionFocus: 'MIDFIELDER',
      description: 'Progressive plan for composure and transition play.',
      createdById: scoutUser.userId,
    },
  });

  const drill = await prisma.drill.upsert({
    where: { id: 'seed-drill-1' },
    update: {
      trainingProgramId: program.id,
      title: 'Cone Passing Circuit',
      type: 'TECHNICAL',
      instructions: 'Complete 3 rounds focusing on first touch and passing angles.',
      videoUrl: 'https://example.com/drills/cone-passing.mp4',
      displayOrder: 1,
    },
    create: {
      id: 'seed-drill-1',
      trainingProgramId: program.id,
      title: 'Cone Passing Circuit',
      type: 'TECHNICAL',
      instructions: 'Complete 3 rounds focusing on first touch and passing angles.',
      videoUrl: 'https://example.com/drills/cone-passing.mp4',
      displayOrder: 1,
    },
  });

  await prisma.drillSubmission.upsert({
    where: { id: 'seed-submission-1' },
    update: {
      playerId: playerUser.userId,
      drillId: drill.id,
      videoUrl: 'https://example.com/submissions/player-1-drill-1.mp4',
      status: 'PENDING',
    },
    create: {
      id: 'seed-submission-1',
      playerId: playerUser.userId,
      drillId: drill.id,
      videoUrl: 'https://example.com/submissions/player-1-drill-1.mp4',
      status: 'PENDING',
    },
  });

  const speedMetric = await prisma.metricType.upsert({
    where: { key: 'speed' },
    update: {
      displayName: 'Speed',
      unit: 'm/s',
      description: 'Sprint speed over standard distance.',
    },
    create: {
      key: 'speed',
      displayName: 'Speed',
      unit: 'm/s',
      description: 'Sprint speed over standard distance.',
    },
  });

  const staminaMetric = await prisma.metricType.upsert({
    where: { key: 'stamina' },
    update: {
      displayName: 'Stamina',
      unit: 'score',
      description: 'Coach assessed stamina score.',
    },
    create: {
      key: 'stamina',
      displayName: 'Stamina',
      unit: 'score',
      description: 'Coach assessed stamina score.',
    },
  });

  await prisma.playerStat.createMany({
    data: [
      {
        playerId: playerUser.userId,
        metricTypeId: speedMetric.id,
        value: 7.2,
        recordedAt: new Date('2026-01-10T10:00:00.000Z'),
        source: 'initial-assessment',
      },
      {
        playerId: playerUser.userId,
        metricTypeId: speedMetric.id,
        value: 7.4,
        recordedAt: new Date('2026-02-10T10:00:00.000Z'),
        source: 'monthly-check',
      },
      {
        playerId: playerUser.userId,
        metricTypeId: staminaMetric.id,
        value: 84,
        recordedAt: new Date('2026-02-10T10:00:00.000Z'),
        source: 'monthly-check',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.shortlist.upsert({
    where: {
      scoutId_playerId: {
        scoutId: scoutUser.userId,
        playerId: playerUser.userId,
      },
    },
    update: {
      notes: 'High-potential midfielder; monitor for 3 months.',
    },
    create: {
      scoutId: scoutUser.userId,
      playerId: playerUser.userId,
      notes: 'High-potential midfielder; monitor for 3 months.',
    },
  });

  await prisma.playerView.create({
    data: {
      scoutId: scoutUser.userId,
      playerId: playerUser.userId,
      viewedAt: new Date(),
    },
  });

  console.log('Database seeded successfully');
  console.log(`Player: ${playerUser.email}`);
  console.log(`Scout: ${scoutUser.email}`);
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
