DROP DATABASE IF EXISTS the_muscle_lab;
CREATE DATABASE the_muscle_lab;
USE the_muscle_lab;

-- Roles table
CREATE TABLE Roles (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    name VARCHAR(30) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE Users (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    role_id CHAR(36) NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    birth_date DATE,

    gender ENUM('Male','Female','Other'),

    profile_image VARCHAR(255),

    join_date DATE DEFAULT (CURRENT_DATE),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id)
        REFERENCES Roles(id)
);

-- Trainers table
CREATE TABLE Trainers (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL UNIQUE,

    specialization VARCHAR(100),

    experience_years INT DEFAULT 0,

    biography TEXT,

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
);

-- Membership plans
CREATE TABLE MembershipPlans (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    name VARCHAR(50) NOT NULL,

    duration_months INT NOT NULL,

    price DECIMAL(8,2) NOT NULL,

    description TEXT
);

-- User memberships
CREATE TABLE UserMemberships (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,

    membership_plan_id CHAR(36) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    status ENUM(
        'Active',
        'Expired',
        'Cancelled'
    ) DEFAULT 'Active',

    FOREIGN KEY (user_id)
        REFERENCES Users(id),

    FOREIGN KEY (membership_plan_id)
        REFERENCES MembershipPlans(id)
);
-- Gym classes
CREATE TABLE Classes (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    trainer_id CHAR(36) NOT NULL,

    title VARCHAR(100) NOT NULL,

    description TEXT,

    class_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    room VARCHAR(50),

    capacity INT NOT NULL,

    FOREIGN KEY (trainer_id)
        REFERENCES Trainers(id)
);

-- Class registrations
CREATE TABLE ClassRegistrations (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    class_id CHAR(36) NOT NULL,

    user_id CHAR(36) NOT NULL,

    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'Registered',
        'Cancelled'
    ) DEFAULT 'Registered',

    UNIQUE (class_id, user_id),

    FOREIGN KEY (class_id)
        REFERENCES Classes(id),

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
);

-- Attendance
CREATE TABLE Attendance (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    class_registration_id CHAR(36) NOT NULL,

    attended BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (class_registration_id)
        REFERENCES ClassRegistrations(id)
);

-- Personal training appointments
CREATE TABLE PersonalTrainingAppointments (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    trainer_id CHAR(36) NOT NULL,

    user_id CHAR(36) NOT NULL,

    appointment_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    status ENUM(
        'Pending',
        'Approved',
        'Cancelled',
        'Completed'
    ) DEFAULT 'Pending',

    notes TEXT,

    FOREIGN KEY (trainer_id)
        REFERENCES Trainers(id),

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
);

-- Payments
CREATE TABLE Payments (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_membership_id CHAR(36) NOT NULL,

    amount DECIMAL(8,2) NOT NULL,

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    payment_method ENUM(
        'Credit Card',
        'Cash',
        'PayPal'
    ) NOT NULL,

    status ENUM(
        'Paid',
        'Pending',
        'Failed'
    ) DEFAULT 'Paid',

    FOREIGN KEY (user_membership_id)
        REFERENCES UserMemberships(id)
);