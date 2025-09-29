--
-- PostgreSQL database dump
--

\restrict dU8DZ3a6VhlkKAd5xRU3AM9qFhWNFuyl3tDQeyYIhbq2eWwnbs6Hc4Uoyv3uOmz

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-29 16:16:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 229 (class 1255 OID 16493)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16402)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16401)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 222 (class 1259 OID 16415)
-- Name: department_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department_categories (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.department_categories OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16414)
-- Name: department_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_categories_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 221
-- Name: department_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_categories_id_seq OWNED BY public.department_categories.id;


--
-- TOC entry 224 (class 1259 OID 16425)
-- Name: digital_systems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.digital_systems (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    full_description text,
    target_audience character varying(50),
    responsible_secretary character varying(10),
    launch_year integer,
    category character varying(20),
    is_highlight boolean DEFAULT false,
    is_new boolean DEFAULT false,
    icon_url text,
    access_url text,
    usage_count integer DEFAULT 0,
    downloads integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0,
    reviews_count integer DEFAULT 0,
    has_pwa boolean DEFAULT false,
    pwa_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    developer character varying(255)
);


ALTER TABLE public.digital_systems OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16424)
-- Name: digital_systems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.digital_systems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.digital_systems_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 223
-- Name: digital_systems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.digital_systems_id_seq OWNED BY public.digital_systems.id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: secretaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secretaries (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.secretaries OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: secretaries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.secretaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.secretaries_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 217
-- Name: secretaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.secretaries_id_seq OWNED BY public.secretaries.id;


--
-- TOC entry 226 (class 1259 OID 16453)
-- Name: system_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_features (
    id integer NOT NULL,
    system_id integer,
    feature text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.system_features OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16452)
-- Name: system_features_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_features_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 225
-- Name: system_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_features_id_seq OWNED BY public.system_features.id;


--
-- TOC entry 228 (class 1259 OID 16468)
-- Name: user_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_reviews (
    id integer NOT NULL,
    system_id integer,
    user_name character varying(100) NOT NULL,
    rating integer,
    comment text,
    date date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.user_reviews OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16467)
-- Name: user_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_reviews_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_reviews_id_seq OWNED BY public.user_reviews.id;


--
-- TOC entry 4771 (class 2604 OID 16405)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 16418)
-- Name: department_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_categories ALTER COLUMN id SET DEFAULT nextval('public.department_categories_id_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 16428)
-- Name: digital_systems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_systems ALTER COLUMN id SET DEFAULT nextval('public.digital_systems_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 16392)
-- Name: secretaries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secretaries ALTER COLUMN id SET DEFAULT nextval('public.secretaries_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 16456)
-- Name: system_features id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_features ALTER COLUMN id SET DEFAULT nextval('public.system_features_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16471)
-- Name: user_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews ALTER COLUMN id SET DEFAULT nextval('public.user_reviews_id_seq'::regclass);


--
-- TOC entry 4974 (class 0 OID 16402)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, code, name, description, created_at, updated_at) FROM stdin;
1	novidades	Novidades	Sistemas mais recentes	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
2	destaques	Destaques	Sistemas em destaque	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
3	mais-usados	Mais Usados	Sistemas mais utilizados	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
4	cidadao	Para o Cidadão	Sistemas voltados para cidadãos	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
5	interno	Para Uso Interno	Sistemas para uso interno	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
6	por-secretaria	Por Secretaria/Órgão	Sistemas organizados por secretaria	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
7	inativos	Inativos	Sistemas Inativos	2025-09-29 14:25:51.132628	2025-09-29 14:25:51.132628
\.


--
-- TOC entry 4976 (class 0 OID 16415)
-- Dependencies: 222
-- Data for Name: department_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department_categories (id, code, name, created_at) FROM stdin;
1	saude	Saúde	2025-09-16 14:38:21.193891
2	educacao	Educação	2025-09-16 14:38:21.193891
3	assistencia-social	Assistência Social	2025-09-16 14:38:21.193891
4	agricultura-pesca-abastecimento	Agricultura, Pesca e Abastecimento	2025-09-16 14:38:21.193891
5	fazenda-financas	Fazenda e Finanças	2025-09-16 14:38:21.193891
6	planejamento	Planejamento	2025-09-16 14:38:21.193891
7	tecnologia	Tecnologia	2025-09-16 14:38:21.193891
8	transito-transporte	Trânsito e Transporte	2025-09-16 14:38:21.193891
9	cultura	Cultura	2025-09-16 14:38:21.193891
10	urbanismo	Urbanismo e Habitação	2025-09-16 14:38:21.193891
\.


--
-- TOC entry 4978 (class 0 OID 16425)
-- Dependencies: 224
-- Data for Name: digital_systems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.digital_systems (id, name, description, full_description, target_audience, responsible_secretary, launch_year, category, is_highlight, is_new, icon_url, access_url, usage_count, downloads, rating, reviews_count, has_pwa, pwa_url, created_at, updated_at, developer) FROM stdin;
8	Pesquisas Turísticas	Site para a realização de pesquisas sobre o turismo realizadas pela SETUR		Turistas	SEMIT	2023	inativos	f	f			0	0	0.00	0	f		2023-01-15 10:30:00	2025-09-29 14:52:05.411706	SEMIT - Equipe de Desenvolvimento
2	Espaço TEA – Aplicativo Inclusivo	Aplicativo inclusivo para atendimento a crianças com TEA.	Aplicativo desenvolvido especialmente para facilitar o atendimento e acompanhamento de crianças com Transtorno do Espectro Autista (TEA).	Cidadãos	SEMUS	2024	novidades	t	t	https://images.unsplash.com/photo-1591608517093-3bb6aa9efe35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2JpbGUlMjBhcHAlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1NzY2NDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral	https://www.saoluis.ma.gov.br/espacotea	\N	8500	4.70	125	t	#	2025-09-16 14:38:21.193891	2025-09-29 10:56:47.786638	SEMIT - Felipe Brito
6	SAE - Selo e Autenticação	Autenticação de documentos digitais sem ICP-Brasil, via login e senha. 	Sistema de autenticação eletrônica que permite validar documentos digitais sem necessidade de certificado ICP-Brasil, utilizando apenas login e senha seguros. 	Cidadãos e servidores	SEMIT	2025	novidades	t	t		https://sae.saoluis.ma.gov.br/login	0	0	0.00	0	f		2025-08-06 10:30:00	2025-09-28 10:30:00	SEMIT - Ashla Karina
\.


--
-- TOC entry 4972 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: secretaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secretaries (id, code, name, description, created_at, updated_at) FROM stdin;
1	SEMUS	Secretaria Municipal de Saúde	Responsável pela saúde pública municipal	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
2	SEMIT	Secretaria Municipal de Informação e Tecnologia	Responsável pela TI e sistemas digitais	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
3	SEMURH	Secretaria Municipal de Urbanismo e Habitação	Responsável por urbanismo e habitação	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
4	SEPLAN	Secretaria Municipal de Planejamento	Responsável pelo planejamento municipal	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
5	SEMFAZ	Secretaria Municipal da Fazenda	Responsável pelas finanças municipais	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
6	SEMAPA	Secretaria Municipal de Agricultura, Pesca e Abastecimento	Responsável pela agricultura, pesca e abastecimento	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
7	SEMED	Secretaria Municipal de Educação	Responsável pela educação municipal	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
8	SMTT	Secretaria Municipal de Trânsito e Transporte	Responsável pelo trânsito e transporte	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
9	SECULT	Secretaria Municipal de Cultura	Responsável pela cultura municipal	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
10	SEMCAS	Secretaria Municipal da Criança e Assistência Social	Responsável pela criança e assistência social	2025-09-16 14:38:21.193891	2025-09-16 14:38:21.193891
\.


--
-- TOC entry 4980 (class 0 OID 16453)
-- Dependencies: 226
-- Data for Name: system_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_features (id, system_id, feature, created_at) FROM stdin;
4	2	Cadastro de usuários	2025-09-16 14:38:21.193891
5	2	Registro de terapias	2025-09-16 14:38:21.193891
6	2	Integração com profissionais	2025-09-16 14:38:21.193891
10	6	Carimbo Digital Oficial	2025-09-29 12:19:41.173281
11	6	Login Seguro	2025-09-29 12:19:41.173281
12	6	Registro de Status do Documento	2025-09-29 12:19:41.173281
\.


--
-- TOC entry 4982 (class 0 OID 16468)
-- Dependencies: 228
-- Data for Name: user_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_reviews (id, system_id, user_name, rating, comment, date, created_at) FROM stdin;
3	2	Ana Paula	5	Aplicativo incrível! Ajudou muito no acompanhamento do meu filho.	2025-01-12	2025-09-16 14:38:21.193891
4	2	Carlos Eduardo	5	Interface amigável e funcionalidades muito úteis para famílias com TEA.	2025-01-08	2025-09-16 14:38:21.193891
\.


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 221
-- Name: department_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_categories_id_seq', 10, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 223
-- Name: digital_systems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.digital_systems_id_seq', 8, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 217
-- Name: secretaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.secretaries_id_seq', 10, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 225
-- Name: system_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_features_id_seq', 12, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_reviews_id_seq', 5, true);


--
-- TOC entry 4797 (class 2606 OID 16413)
-- Name: categories categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_code_key UNIQUE (code);


--
-- TOC entry 4799 (class 2606 OID 16411)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16423)
-- Name: department_categories department_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_categories
    ADD CONSTRAINT department_categories_code_key UNIQUE (code);


--
-- TOC entry 4803 (class 2606 OID 16421)
-- Name: department_categories department_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_categories
    ADD CONSTRAINT department_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16441)
-- Name: digital_systems digital_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_systems
    ADD CONSTRAINT digital_systems_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 16400)
-- Name: secretaries secretaries_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secretaries
    ADD CONSTRAINT secretaries_code_key UNIQUE (code);


--
-- TOC entry 4795 (class 2606 OID 16398)
-- Name: secretaries secretaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secretaries
    ADD CONSTRAINT secretaries_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16461)
-- Name: system_features system_features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_features
    ADD CONSTRAINT system_features_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16478)
-- Name: user_reviews user_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT user_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 1259 OID 16484)
-- Name: idx_digital_systems_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_category ON public.digital_systems USING btree (category);


--
-- TOC entry 4807 (class 1259 OID 16489)
-- Name: idx_digital_systems_downloads; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_downloads ON public.digital_systems USING btree (downloads);


--
-- TOC entry 4808 (class 1259 OID 16486)
-- Name: idx_digital_systems_highlight; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_highlight ON public.digital_systems USING btree (is_highlight);


--
-- TOC entry 4809 (class 1259 OID 16487)
-- Name: idx_digital_systems_new; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_new ON public.digital_systems USING btree (is_new);


--
-- TOC entry 4810 (class 1259 OID 16488)
-- Name: idx_digital_systems_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_rating ON public.digital_systems USING btree (rating);


--
-- TOC entry 4811 (class 1259 OID 16485)
-- Name: idx_digital_systems_secretary; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_digital_systems_secretary ON public.digital_systems USING btree (responsible_secretary);


--
-- TOC entry 4812 (class 1259 OID 16490)
-- Name: idx_system_features_system; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_features_system ON public.system_features USING btree (system_id);


--
-- TOC entry 4815 (class 1259 OID 16492)
-- Name: idx_user_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_reviews_rating ON public.user_reviews USING btree (rating);


--
-- TOC entry 4816 (class 1259 OID 16491)
-- Name: idx_user_reviews_system; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_reviews_system ON public.user_reviews USING btree (system_id);


--
-- TOC entry 4824 (class 2620 OID 16496)
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4825 (class 2620 OID 16494)
-- Name: digital_systems update_digital_systems_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_digital_systems_updated_at BEFORE UPDATE ON public.digital_systems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4823 (class 2620 OID 16495)
-- Name: secretaries update_secretaries_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_secretaries_updated_at BEFORE UPDATE ON public.secretaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4819 (class 2606 OID 16447)
-- Name: digital_systems digital_systems_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_systems
    ADD CONSTRAINT digital_systems_category_fkey FOREIGN KEY (category) REFERENCES public.categories(code);


--
-- TOC entry 4820 (class 2606 OID 16442)
-- Name: digital_systems digital_systems_responsible_secretary_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_systems
    ADD CONSTRAINT digital_systems_responsible_secretary_fkey FOREIGN KEY (responsible_secretary) REFERENCES public.secretaries(code);


--
-- TOC entry 4821 (class 2606 OID 16462)
-- Name: system_features system_features_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_features
    ADD CONSTRAINT system_features_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.digital_systems(id) ON DELETE CASCADE;


--
-- TOC entry 4822 (class 2606 OID 16479)
-- Name: user_reviews user_reviews_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT user_reviews_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.digital_systems(id) ON DELETE CASCADE;


-- Completed on 2025-09-29 16:16:43

--
-- PostgreSQL database dump complete
--

\unrestrict dU8DZ3a6VhlkKAd5xRU3AM9qFhWNFuyl3tDQeyYIhbq2eWwnbs6Hc4Uoyv3uOmz

