import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      { username: 'maya.runners', email: 'maya@example.com', displayName: 'Maya Runners' },
      { username: 'jordan.lifts', email: 'jordan@example.com', displayName: 'Jordan Lifts' },
      { username: 'alex.moves', email: 'alex@example.com', displayName: 'Alex Moves' },
      { username: 'sam.trains', email: 'sam@example.com', displayName: 'Sam Trains' },
    ]);

    await Team.create([
      {
        name: 'Trail Blazers',
        description: 'Weekend runners building steady mileage together.',
        memberIds: [users[0]._id, users[2]._id],
      },
      {
        name: 'Strength Squad',
        description: 'A supportive group focused on functional strength.',
        memberIds: [users[1]._id, users[3]._id],
      },
    ]);

    await Activity.create([
      { userId: users[0]._id, type: 'running', durationMinutes: 42, distanceKm: 6.4, points: 64, completedAt: new Date('2026-09-14') },
      { userId: users[0]._id, type: 'cycling', durationMinutes: 35, distanceKm: 10.2, points: 48, completedAt: new Date('2026-09-17') },
      { userId: users[1]._id, type: 'strength', durationMinutes: 50, points: 58, completedAt: new Date('2026-09-15') },
      { userId: users[1]._id, type: 'walking', durationMinutes: 30, distanceKm: 2.7, points: 30, completedAt: new Date('2026-09-18') },
      { userId: users[2]._id, type: 'running', durationMinutes: 28, distanceKm: 4.1, points: 41, completedAt: new Date('2026-09-16') },
      { userId: users[3]._id, type: 'strength', durationMinutes: 40, points: 46, completedAt: new Date('2026-09-13') },
    ]);

    await Leaderboard.create([
      { userId: users[0]._id, rank: 1, points: 112, activities: 2, period: 'September 2026' },
      { userId: users[1]._id, rank: 2, points: 88, activities: 2, period: 'September 2026' },
      { userId: users[3]._id, rank: 3, points: 46, activities: 1, period: 'September 2026' },
      { userId: users[2]._id, rank: 4, points: 41, activities: 1, period: 'September 2026' },
    ]);

    await Workout.create([
      {
        title: 'Quick Cardio Circuit',
        description: 'A fast-paced session for building everyday endurance.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 20,
        exercises: ['Jumping jacks', 'High knees', 'Bodyweight squats'],
      },
      {
        title: 'Full Body Strength',
        description: 'A balanced strength workout using bodyweight movements.',
        category: 'strength',
        difficulty: 'intermediate',
        durationMinutes: 35,
        exercises: ['Push-ups', 'Reverse lunges', 'Plank shoulder taps'],
      },
      {
        title: 'Mobility Reset',
        description: 'Gentle mobility work to recover and move with control.',
        category: 'mobility',
        difficulty: 'beginner',
        durationMinutes: 15,
        exercises: ['Worlds greatest stretch', 'Hip circles', 'Cat-cow'],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seedDatabase();
