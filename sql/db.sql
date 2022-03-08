DROP DATABASE IF EXISTS school_campus;
CREATE DATABASE school_campus;
USE school_campus;

-- ROL DE UN USUARIO --
CREATE TABLE role(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    see_all BOOLEAN DEFAULT FALSE NOT NULL,
    create_users BOOLEAN DEFAULT FALSE NOT NULL
);

-- USUARIO --
CREATE TABLE user(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    roleId INTEGER REFERENCES role(id) ,
    name VARCHAR(30) NOT NULL,
    lastname1 VARCHAR(50) NOT NULL,
    lastname2 VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    token VARCHAR(250),
    initialized BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- CURSO (AÑO) --
CREATE TABLE year(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(9) NOT NULL UNIQUE
);
-- CLASE --
CREATE TABLE class(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    yearId INTEGER REFERENCES year(id) ,
    grade VARCHAR(6) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT UC_Class UNIQUE (yearId, grade)
);

-- USER_CLASS (TABLA UNIÓN USUARIO-CLASE) --
CREATE TABLE User_Class(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INTEGER REFERENCES year(id),
    classId INTEGER REFERENCES class(id),
    type VARCHAR(2) NOT NULL
);
-- ASIGNATURA --
CREATE TABLE subject(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT TRUE NOT NULL
);
-- CUESTIONARIO --
CREATE TABLE questionnaire(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INTEGER REFERENCES user(id) ,
    subjectId INTEGER REFERENCES subject(id),
    title VARCHAR(250) NOT NULL,
    visible BOOLEAN DEFAULT TRUE NOT NULL,
    reviewable BOOLEAN DEFAULT TRUE NOT NULL,
    can_remake BOOLEAN DEFAULT TRUE NOT NULL,
    view_grade BOOLEAN DEFAULT TRUE NOT NULL,
    raw_data TEXT NOT NULL,
    student_data TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- QUESTIONNAIRE_CLASS (TABLA UNIÓN CUESTIONARIO-CLASE) --
CREATE TABLE questionnaire_class(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    questionnaireId INTEGER NOT NULL REFERENCES questionnaire(id),
    classId INTEGER NOT NULL REFERENCES class(id) 
);
-- CORRECIÓN/RESPUESTA --
CREATE TABLE answer(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INTEGER REFERENCES user(id) ,
    questionnaireId INTEGER REFERENCES questionnaire(id),
    visible BOOLEAN DEFAULT TRUE NOT NULL,
    grade FLOAT NOT NULL,
    total_questions INT NOT NULL,
    questions_answered INT NOT NULL,
    revision TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CREACIÓN DE ROLES --
INSERT INTO role (name, see_all, create_users) VALUES ('admin', 1, 1);
INSERT INTO role (name, see_all, create_users) VALUES ('teacher', 1, 0);
INSERT INTO role (name, see_all, create_users) VALUES ('student', 0, 0);

-- usuario: admin password: admin --
INSERT INTO user (roleId, name, lastname1, lastname2, username, password, token, initialized)
    VALUES (1, 'Admin', '', '',
     'admin', '$2a$10$lFzmjYGcs9wsyTjCG.lSgOiWdxyqeGoyjrfQ2KmobMZwSoWarmNhC',
     '477cda7a11bdd8df681d6ea3d5c5b473', true);

-- asignatura oficiales --
INSERT INTO subject (name) VALUES ("Matemáticas");
INSERT INTO subject (name) VALUES ("Música");
INSERT INTO subject (name) VALUES ("Educación Plástica");
INSERT INTO subject (name) VALUES ("Conocimiento del Medio");
INSERT INTO subject (name) VALUES ("Inglés");
INSERT INTO subject (name) VALUES ("Lengua Castellana");
INSERT INTO subject (name) VALUES ("Educación Física");

-- cursos escolares --
INSERT INTO year (grade) VALUES ("2021/2022");
INSERT INTO year (grade) VALUES ("2022/2023");
INSERT INTO year (grade) VALUES ("2023/2024");
INSERT INTO year (grade) VALUES ("2024/2025");
INSERT INTO year (grade) VALUES ("2025/2026");
INSERT INTO year (grade) VALUES ("2026/2027");
INSERT INTO year (grade) VALUES ("2027/2028");
INSERT INTO year (grade) VALUES ("2028/2029");
INSERT INTO year (grade) VALUES ("2029/2030");
INSERT INTO year (grade) VALUES ("2030/2031");
INSERT INTO year (grade) VALUES ("2031/2032");

