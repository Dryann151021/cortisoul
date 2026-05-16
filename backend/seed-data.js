import 'dotenv/config';
import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool();

const dummyUsers = [
  {
    username: 'john_doe',
    password: 'password123',
    fullname: 'John Doe',
  },
  {
    username: 'jane_smith',
    password: 'password123',
    fullname: 'Jane Smith',
  },
  {
    username: 'alex_wilson',
    password: 'password123',
    fullname: 'Alex Wilson',
  },
];

const dummyJournals = [
  {
    title: 'Morning Fog Clearing',
    content:
      'I decided to take just 10 minutes to sit with my coffee before opening my laptop. The silence in the kitchen was heavy at first, but then I noticed the light catching the steam from the mug.',
    stressScore: 5.5,
    emotion: 'Calm / Peaceful',
  },
  {
    title: 'Productive Day',
    content:
      'Finished all my tasks today. Feeling accomplished and energized. The team collaboration went smoothly and we achieved more than expected.',
    stressScore: 3.2,
    emotion: 'Happy / Joyful',
  },
  {
    title: 'Overwhelmed',
    content:
      'Too many things happening at once. Deadlines piling up, emails not stopping. Trying to breathe and prioritize but it feels impossible.',
    stressScore: 8.5,
    emotion: 'Anxious / Restless',
  },
  {
    title: 'Peaceful Evening',
    content:
      'Took a walk in the park. The weather was perfect. Watched the sunset and felt my worries slowly fade away.',
    stressScore: 2.0,
    emotion: 'Calm / Peaceful',
  },
  {
    title: 'Creative Breakthrough',
    content:
      'Had an amazing idea for the project today. Everything just clicked and I could see the whole picture coming together.',
    stressScore: 1.5,
    emotion: 'Happy / Joyful',
  },
  {
    title: 'Difficult Conversation',
    content:
      'Had a hard talk with someone today. It was uncomfortable but necessary. Feeling drained but also relieved.',
    stressScore: 6.5,
    emotion: 'Sad / Melancholic',
  },
  {
    title: 'Rest Day',
    content:
      'Finally had time to rest and recharge. No meetings, no rush. Just me, good book, and tea.',
    stressScore: 1.8,
    emotion: 'Calm / Peaceful',
  },
];

async function seedDummyData() {
  try {
    // Clear existing data
    await pool.query('DELETE FROM journals');
    await pool.query('DELETE FROM users');

    // Create users
    const userIds = [];

    for (const user of dummyUsers) {
      const userId = nanoid(16);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const now = new Date().toISOString();

      const query = {
        text: `
          INSERT INTO users (id, username, password, fullname, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `,
        values: [
          userId,
          user.username,
          hashedPassword,
          user.fullname,
          now,
          now,
        ],
      };

      const result = await pool.query(query);
      userIds.push(result.rows[0].id);
      console.log(`User: ${user.username} (${userId})`);
    }

    // 2. Create journals for each user

    for (const userId of userIds) {
      const userQuery = await pool.query(
        'SELECT username FROM users WHERE id = $1',
        [userId]
      );
      const username = userQuery.rows[0].username;

      console.log(`journals for ${username}:`);

      for (let i = 0; i < dummyJournals.length; i++) {
        const journal = dummyJournals[i];
        const id = nanoid(16);
        const now = new Date();

        // Spread journals across last 6 days
        const daysAgo = Math.max(0, i - 1);
        const createdAt = new Date(
          now.getTime() - daysAgo * 24 * 60 * 60 * 1000
        ).toISOString();

        const query = {
          text: `
            INSERT INTO journals (id, title, content, created_at, updated_at, stress_score, emotion, owner)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `,
          values: [
            id,
            journal.title,
            journal.content,
            createdAt,
            createdAt,
            journal.stressScore,
            journal.emotion,
            userId,
          ],
        };

        await pool.query(query);
        console.log(`${journal.title}`);
      }
    }

    console.log(`- Users: ${dummyUsers.length}`);
    console.log(`- Journals per user: ${dummyJournals.length}`);

    console.log('\n Test credentials:');
    dummyUsers.forEach((user) => {
      console.log(`- Username: ${user.username} | Password: ${user.password}`);
    });

    pool.end();
  } catch (error) {
    console.error('Error seeding data:', error);
    pool.end();
    process.exit(1);
  }
}

seedDummyData();
