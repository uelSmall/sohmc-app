# Database Schema & RLS Policies

## ⚠️ Important: Deprecated `users` Table

**The custom `users` table is NO LONGER USED in active code.** Your app now uses:
- `auth.users` (Supabase built-in for authentication)
- `profiles` (custom table linked to `auth.users` for user data)

Some legacy queries still reference the old `users` table (e.g., admin/users, select-role, lessons/upload pages), but this should be migrated to `profiles` for consistency.

---

## Core Tables (Currently in Use)

### `auth.users` (Supabase Built-in)
Supabase authentication system.
- `id` (UUID, PK) - User's unique auth ID
- `email` (TEXT)
- `created_at` (TIMESTAMP)

### `profiles`
**Primary user data table.** Linked 1:1 to `auth.users`.
- `id` (UUID, PK) - References `auth.users(id)`
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT, default: 'https://example.com/default-avatar.png')
- `role` (user_role enum) - 'student' | 'teacher' | 'parent' | 'admin' (default: 'student')
- `instrument` (TEXT)
- `phone` (TEXT)
- `bio` (TEXT)
- `created_at` (TIMESTAMP, default: now())

**Authentication pattern in code:**
```typescript
// Get auth user
const { data: { user } } = await locals.supabase.auth.getUser();

// Fetch profile data (linked by id)
const { data: profile } = await locals.supabase
  .from('profiles')
  .select('role, full_name, instrument')
  .eq('id', user.id)
  .single();
```

### `lessons`
Educational content for students.
- `id` (UUID, PK, default: gen_random_uuid())
- `title` (TEXT, required)
- `description` (TEXT, required)
- `instrument` (TEXT) - Lesson target instrument
- `content_type` (TEXT, required) - 'video' | 'pdf' | 'text' | 'audio' etc.
- `content_url` (TEXT) - URL to hosted content
- `content_body` (TEXT) - Inline content (for text-based lessons)
- `teacher_id` (UUID) - FK to teacher's `profiles.id`
- `order_index` (INT, default: 1) - Lesson sequence
- `published` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP, default: now())

### `assignments`
Student assignments tied to lessons.
- `id` (UUID, PK, default: gen_random_uuid())
- `student_id` (UUID) - FK to student's UUID
- `lesson_id` (UUID) - FK to `lessons(id)`
- `status` (TEXT, default: 'not_started') - 'not_started' | 'in_progress' | 'completed'
- `updated_at` (TIMESTAMP, default: now())

### `lesson_progress`
Tracks student progress through lessons.
- `id` (UUID, PK, default: gen_random_uuid())
- `user_id` (UUID) - FK to `users(id)` or `auth.users(id)`
- `lesson_id` (UUID) - FK to `lessons(id)`
- `status` (TEXT) - 'not_started' | 'in_progress' | 'completed'
- `last_viewed_at` (TIMESTAMP)
- `notes` (TEXT)

### `parent_children`
Links parent users to their student children.
- `parent_id` (UUID, PK) - Parent's user ID
- `child_id` (UUID, PK) - Child's user ID

---

## Row Level Security (RLS) Policies

### `profiles`
| Policy | Role(s) | Operations |
|--------|---------|-----------|
| Users can view their own profile | Any | SELECT |
| Users can update their own profile | Any | UPDATE |
| Users can insert their own profile | Any | INSERT |

### `users`
| Policy | Role(s) | Condition |
|--------|---------|-----------|
| Select own profile | Any | `auth.uid() = user_id` |
| Insert own profile | Any | (Allow all) |
| Update own profile | Any | `auth.uid() = user_id` |
| Admins can manage all users | admin | (Full access) |

### `lessons`
| Policy | Role(s) | Condition |
|--------|---------|-----------|
| Public can read published lessons | Any | `published = true` |
| Students can view published lessons | student | `published = true AND instrument matches student's instrument` |
| Teachers can view their lessons | teacher | `auth.uid() = teacher_id` |
| Teachers can manage their lessons | teacher | `auth.uid() = teacher_id` (INSERT/UPDATE/DELETE) |
| Teachers can select all lessons | teacher | (Full SELECT) |
| Admins can manage all lessons | admin | (Full access) |

### `assignments`
| Policy | Role(s) | Condition |
|--------|---------|-----------|
| Students can view their assignments | student | `student_id = current_user_id` |
| Teachers can view assignments for their lessons | teacher | Lesson must be taught by current user |
| Teachers can insert assignments | teacher | (Allow) |
| Teachers can update assignments | teacher | Lesson must be taught by current user |
| Teachers can delete assignments | teacher | Lesson must be taught by current user |
| Admins can manage all assignments | admin | (Full access) |

### `lesson_progress`
| Policy | Role(s) | Condition |
|--------|---------|-----------|
| Students can view their own progress | student | `user_id = auth.uid()` |
| Students can update their own progress | student | `user_id = auth.uid()` |
| Students can insert their own progress | student | (Allow) |

---

## Data Access Patterns

### For Students:
- Can see their own profile and lessons assigned to them
- Can view published lessons matching their instrument
- Can track progress via `lesson_progress` table
- Cannot see other students' assignments or progress

### For Teachers:
- Can create/edit/delete their own lessons
- Can view all lessons in the system
- Can create and manage assignments for students
- Can see assignment progress for their lessons
- Cannot manage lessons created by other teachers

### For Parents:
- Linked to children via `parent_children` table
- Can view children's progress through `lesson_progress`
- Read-only access to assignments and lessons

### For Admins:
- Full access to all tables (users, lessons, assignments, etc.)
- Can manage all user roles and data

---

## Relationships (Foreign Keys)

```
users (1) ──────── (M) profiles
           id      ↓ id

users (1) ──────── (M) lessons
           id      ↓ teacher_id

users (1) ──────── (M) assignments
           id      ↓ student_id

lessons (1) ──────---- (M) assignments
             id        ↓ lesson_id

lessons (1) ──────---- (M) lesson_progress
             id        ↓ lesson_id

profiles (1) ────────── (M) lesson_progress
              id        ↓ user_id

users (1) ──────────── (M) parent_children (parent_id)
           id          ↓ parent_id

users (1) ──────────── (M) parent_children (child_id)
           id          ↓ child_id
```

### Key Relationships:
- **users → profiles**: One user has one profile (1:1, profiles.id FK to users.id)
- **users → lessons**: One teacher creates many lessons (1:M, lessons.teacher_id FK to users.id)
- **users → assignments**: One student has many assignments (1:M, assignments.student_id FK to users.id)
- **lessons → assignments**: One lesson has many student assignments (1:M, assignments.lesson_id FK to lessons.id)
- **lessons → lesson_progress**: One lesson has many progress records (1:M, lesson_progress.lesson_id FK to lessons.id)
- **profiles → lesson_progress**: One profile has many progress records (1:M, lesson_progress.user_id FK to profiles.id)
- **users → parent_children**: Bidirectional relationship for family links

---

## Important Notes

1. **Dual user system**: The `users` table extends `auth.users` with custom fields (role, instrument array)
2. **Instrument filtering**: Lessons/assignments are filtered by student's instruments (stored as array in `users.instrument`)
3. **Published lessons**: Only lessons with `published = true` are visible to students
4. **Teacher ownership**: Lessons are tied to teacher_id; teachers can only manage their own
5. **Progress tracking**: Use `lesson_progress` for detailed tracking, `assignments` for task management
