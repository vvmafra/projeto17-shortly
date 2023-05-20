--
-- PostgreSQL database dump
--

-- Dumped from database version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE TABLE public."users" (
    id serial primary key NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp
);

CREATE TABLE public."users" (
    id serial primary key NOT NULL,
    "idUser" integer NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp
);

CREATE TABLE public."urls" (
	"id" serial primary key NOT NULL,
	"idUser" integer NOT NULL,
	"idLogin" integer NOT NULL,
	"url" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL UNIQUE,
	"views" integer DEFAULT '0',
	"createdAt" TIMESTAMP
);
--
-- PostgreSQL database dump complete
--
