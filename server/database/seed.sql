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
    'Admin',
    'User',
    'admin@musclelab.com',
    '$2b$10$4Pzxp0CoAinHhjTp8DxnUO2usj0btT2OrL8/8kcze3snF9pdL1y5O',
    '0501111111',
    '1995-01-01',
    'Male'
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
    'John',
    'Trainer',
    'trainer@musclelab.com',
    '$2b$10$34/Dfn3QCIsngelJOABpHO8WoKCt1cO2gtx.h2E9MnRfzcIknt.42',
    '0502222222',
    '1992-06-10',
    'Male'
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
    'Sarah',
    'Cohen',
    'sarah@example.com',
    '$2b$10$lOU4/FAAbW3gsbpBN1UfkeJsYCqkvDtXvbKR74C76uSIY44cEq08K',
    '0503333333',
    '2000-03-15',
    'Female'
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
    'David',
    'Levi',
    'david@example.com',
    '$2b$10$lOU4/FAAbW3gsbpBN1UfkeJsYCqkvDtXvbKR74C76uSIY44cEq08K',
    '0504444444',
    '1998-08-20',
    'Male'
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
WHERE email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'sarah@example.com'
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
WHERE u.email = 'david@example.com'
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
AND u.email = 'sarah@example.com';

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
AND u.email = 'david@example.com';

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
WHERE trainerUser.email = 'trainer@musclelab.com'
AND u.email = 'sarah@example.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';

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
WHERE u.email = 'trainer@musclelab.com';