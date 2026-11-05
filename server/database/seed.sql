-- FICTIONAL LOCAL DEVELOPMENT DATA ONLY. Never import these accounts into production.
-- All identities and activity records below are demo fixtures, not real people or transactions.
-- Contact numbers, birth dates, and gender are intentionally NULL.
-- Public demo password for all four accounts: Local-demo-only-2026!
-- The bcrypt verifiers below were generated solely for this public development fixture.

USE the_muscle_lab;

-- Roles
INSERT INTO Roles (name)
VALUES
('Admin'),
('Trainer'),
('Member');

-- Membership plans
INSERT INTO MembershipPlans (name, duration_months, price, description)
VALUES
('Basic', 1, 199.99, 'Basic monthly membership'),
('Premium', 3, 499.99, 'Premium membership'),
('VIP', 12, 1699.99, 'VIP yearly membership');

-- Users
INSERT INTO Users (
    role_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    birth_date,
    gender
)
SELECT
    id,
    'Demo',
    'Admin',
    'demo-admin@example.com',
    '$2b$10$iF/BTohHPOBtEBqdOM.WpeXuHgHqzOhb2JD86hZLUCIThwCa6GRa.',
    NULL,
    NULL,
    NULL
FROM Roles
WHERE name = 'Admin';

INSERT INTO Users (
    role_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    birth_date,
    gender
)
SELECT
    id,
    'Demo',
    'Trainer',
    'demo-trainer@example.com',
    '$2b$10$ERfSc4R.F.7PUlbvHG5AFeANsG.1PHeit1nqt6qfvj2Wr/y73Z0Fm',
    NULL,
    NULL,
    NULL
FROM Roles
WHERE name = 'Trainer';

INSERT INTO Users (
    role_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    birth_date,
    gender
)
SELECT
    id,
    'Demo',
    'Member One',
    'demo-member-one@example.com',
    '$2b$10$NqMXuhYFsN2Yh4ivRjK9LOSab5GwKfJL/Uzz7x2lzVux4EpAgex9i',
    NULL,
    NULL,
    NULL
FROM Roles
WHERE name = 'Member';

INSERT INTO Users (
    role_id,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    birth_date,
    gender
)
SELECT
    id,
    'Demo',
    'Member Two',
    'demo-member-two@example.com',
    '$2b$10$dYg8g7DLbEaPz/59HHapn.sl93QBSgAtyNj5aEw1ih1obzhAWSLBa',
    NULL,
    NULL,
    NULL
FROM Roles
WHERE name = 'Member';

-- Trainer
INSERT INTO Trainers (
    user_id,
    specialization,
    experience_years,
    biography
)
SELECT
    id,
    'Strength Training',
    8,
    'Certified personal trainer'
FROM Users
WHERE email = 'demo-trainer@example.com';

-- Classes
INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'HIIT',
    'High intensity interval training',
    '2026-08-01',
    '18:00:00',
    '19:00:00',
    'Studio A',
    20
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Yoga',
    'Beginner yoga class',
    '2026-08-02',
    '09:00:00',
    '10:00:00',
    'Studio B',
    15
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

-- User memberships
INSERT INTO UserMemberships (
    user_id,
    membership_plan_id,
    start_date,
    end_date,
    status
)
SELECT
    u.id,
    m.id,
    '2026-07-01',
    '2026-08-01',
    'Active'
FROM Users u
JOIN MembershipPlans m
WHERE u.email = 'demo-member-one@example.com'
AND m.name = 'Basic';

INSERT INTO UserMemberships (
    user_id,
    membership_plan_id,
    start_date,
    end_date,
    status
)
SELECT
    u.id,
    m.id,
    '2026-07-01',
    '2026-10-01',
    'Active'
FROM Users u
JOIN MembershipPlans m
WHERE u.email = 'demo-member-two@example.com'
AND m.name = 'Premium';

-- Class registrations
INSERT INTO ClassRegistrations (
    class_id,
    user_id
)
SELECT
    c.id,
    u.id
FROM Classes c
JOIN Users u
WHERE c.title = 'HIIT'
AND u.email = 'demo-member-one@example.com';

INSERT INTO ClassRegistrations (
    class_id,
    user_id
)
SELECT
    c.id,
    u.id
FROM Classes c
JOIN Users u
WHERE c.title = 'Yoga'
AND u.email = 'demo-member-two@example.com';

-- Attendance
INSERT INTO Attendance (
    class_registration_id,
    attended
)
SELECT
    id,
    FALSE
FROM ClassRegistrations;

-- Personal training appointments
INSERT INTO PersonalTrainingAppointments (
    trainer_id,
    user_id,
    appointment_date,
    start_time,
    end_time,
    status,
    notes
)
SELECT
    t.id,
    u.id,
    '2026-08-03',
    '17:00:00',
    '18:00:00',
    'Pending',
    'First personal training session'
FROM Trainers t
JOIN Users trainerUser ON t.user_id = trainerUser.id
JOIN Users u
WHERE trainerUser.email = 'demo-trainer@example.com'
AND u.email = 'demo-member-one@example.com';

-- Payments
INSERT INTO Payments (
    user_membership_id,
    amount,
    payment_method,
    status
)
SELECT
    um.id,
    mp.price,
    'Credit Card',
    'Paid'
FROM UserMemberships um
JOIN MembershipPlans mp
ON um.membership_plan_id = mp.id;

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Pilates',
    'Core strength and flexibility',
    '2026-08-03',
    '10:00:00',
    '11:00:00',
    'Studio A',
    18
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'CrossFit',
    'High intensity functional workout',
    '2026-08-04',
    '18:30:00',
    '19:30:00',
    'Studio C',
    20
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Spinning',
    'Indoor cycling workout',
    '2026-08-05',
    '19:00:00',
    '20:00:00',
    'Studio B',
    16
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Strength Builder',
    'Full body strength session',
    '2026-08-06',
    '17:30:00',
    '18:30:00',
    'Studio D',
    22
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Mobility Flow',
    'Recovery and mobility class',
    '2026-08-07',
    '08:30:00',
    '09:30:00',
    'Studio A',
    14
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Boxing Blast',
    'Cardio boxing circuit',
    '2026-08-08',
    '20:00:00',
    '21:00:00',
    'Studio C',
    18
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';

INSERT INTO Classes (
    trainer_id,
    title,
    description,
    class_date,
    start_time,
    end_time,
    room,
    capacity
)
SELECT
    t.id,
    'Core Sculpt',
    'Focused core and posture workout',
    '2026-08-09',
    '12:00:00',
    '13:00:00',
    'Studio B',
    12
FROM Trainers t
JOIN Users u ON t.user_id = u.id
WHERE u.email = 'demo-trainer@example.com';
