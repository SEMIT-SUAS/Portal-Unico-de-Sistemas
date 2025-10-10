--
-- PostgreSQL database dump
--

\restrict pKs8wjhmXlyNGy1F5v9ZgOgFYoYCAlwyVvSxaN4dM80KkHVic0VCusmA8IXtpW7

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-10 18:04:16

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
    target_audience character varying(100),
    responsible_secretary character varying(100),
    launch_year integer,
    category character varying(100),
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
    developer character varying(100)
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
11	turismo	Turismo	2025-10-02 22:00:13.165675
12	comunicacao	Comunicação	2025-10-02 22:04:35.353779
13	seguranca	Segurança	2025-10-10 13:38:18.034155
\.


--
-- TOC entry 4978 (class 0 OID 16425)
-- Dependencies: 224
-- Data for Name: digital_systems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.digital_systems (id, name, description, full_description, target_audience, responsible_secretary, launch_year, category, is_highlight, is_new, icon_url, access_url, usage_count, downloads, rating, reviews_count, has_pwa, pwa_url, created_at, updated_at, developer) FROM stdin;
8	Pesquisas Turísticas	Site para a realização de pesquisas sobre o turismo realizadas pela SETUR		Turistas	SEMIT	2023	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png		0	0	0.00	0	f		2023-01-15 10:30:00	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento
11	Agendamento CRAS	Sistema de agendamento de atendimento em unidades do CRAS para cidadãos serem atendidos pela SEMCAS	Ferramenta online que permite ao cidadão agendar atendimentos nas unidades do CRAS de forma simples e rápida, otimizando o acesso aos serviços da Secretaria Municipal da Criança e Assistência Social (SEMCAS)	Cidadãos	SEMCAS	2023	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://saoluis.ma.gov.br/agendamentocadunico	0	0	0.00	0	f		2023-05-15 10:30:00	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
14	Conecta	Processo de contratação de empresa especializada em serviço de mapeamento de processos e fluxos processuais para a PMSL	Projeto voltado para o mapeamento e otimização de processos e fluxos de trabalho internos da Prefeitura, visando aumentar a eficiência e a modernização administrativa sob a coordenação da SEMIT	Servidores e docentes da SEMED, alunos e pais	SEMIT	2023	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://conecta.saoluis.ma.gov.br/	0	0	0.00	0	f		2023-08-15 10:30:00	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
341	São Luís Inteligente	Auxiliamos no sistema de consulta pública sobre o Plano Municipal de Cidades Inteligentes organizado pela SEMISPE	Plataforma de consulta pública para coletar a opinião e sugestões da população sobre o Plano Municipal de Cidades Inteligentes, promovendo a participação cidadã nas decisões estratégicas da SEMISPE	Cidadão	SEMISPE	2023	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
342	SGCP	Processo de contratação de empresa especializada para a Implantação e Licenciamento do Sistema de Gestão de Contratações Públicas para a PSML	Ferramenta para a gestão eletrônica de todas as fases das contratações públicas, desde a licitação até a gestão dos contratos, garantindo maior controle e transparência para os processos da Prefeitura	Servidores	SEMIT	2023	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://pcacontratos.saoluis.ma.gov.br/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	PCA Contratos (Contratado)
343	Registra Guarda	Sistema de gerenciamento de registros de ocorrência para a SEMUSC	Sistema interno para o registro e gerenciamento de ocorrências atendidas pela Guarda Municipal, permitindo um controle estatístico e operacional das atividades da corporação	Guardas municipais	SEMUSC	2023	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://registraguarda.saoluis.ma.gov.br/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
344	Atenas SIT	Sistema de Inteligência Turísitica, painel BI com dados do turismo feito para a SETUR	Painel de Business Intelligence (BI) que consolida e apresenta dados estratégicos sobre o turismo em São Luís, auxiliando a SETUR na tomada de decisões e no planejamento de políticas públicas	Gestores da SETUR	SETUR	2023	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://transparenciabi.saoluis.ma.gov.br/extensions/SETUR/SETUR.html	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
345	SPA	Licitação do Sistema de gestão de processos jurídicos e dívida ativa para a PGM	Plataforma robusta para a gestão de processos jurídicos, controle da dívida ativa e automação de fluxos de trabalho da Procuradoria Geral do Município, visando a modernização e eficiência jurídica	Procuradores e servidores	PGM	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://diariooficial.saoluis.ma.gov.br/documento/view/9086/contrato-n-022024-pregao-eletronico-n-2692023-cplpmslma	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	Empresa contratada (via licitação)
347	Hotsite Feira do Livro SECULT	Site contendo a programação de eventos e localizações da feira do livro de São Luís.	Site temporário contendo a programação detalhada, locais e horários dos eventos da Feira do Livro de São Luís (FILS), organizado pela SECULT	Cidadão	SECULT	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
348	Diário Oficial	Novo sistema de diário oficial para a SEMAD	Nova plataforma para publicação e consulta dos atos oficiais do poder executivo municipal, oferecendo mais transparência, segurança e facilidade de acesso aos documentos	Cidadãos, empresas e servidores	SEMAD	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://diariooficial.saoluis.ma.gov.br/documento/view/9086/contrato-n-022024-pregao-eletronico-n-2692023-cplpmslma	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
10	Prefeitura em Ação	Sistema de gerenciamento de ações realizadas pela prefeitura para a SECOM	Plataforma para o gerenciamento centralizado e acompanhamento das ações e projetos executados pela Prefeitura de São Luís, destinada a otimizar a comunicação e a transparência das iniciativas para a SECOM	Servidores da SECOM e gestores municipais	SECOM	2023	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f		2023-01-15 10:30:00	2025-10-10 13:25:54.42312	SEMIT - Equipe de Desenvolvimento Interno
349	Painel BI SEMAD Pagamentos	O BI da SEMAD foi desenvolvido para fornecer uma visão detalhada da folha de pagamento dos servidores da Prefeitura de São Luís, com foco na transparência e controle das informações financeiras.	Ferramenta de Business Intelligence focada na análise da folha de pagamento dos servidores municipais, permitindo uma visão detalhada e transparente dos gastos com pessoal e auxiliando no controle financeiro	Gestores da SEMAD	SEMAD	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://bi.saoluis.ma.gov.br/sense/app/da5dbbb0-c762-4f58-803e-03734f664607/overview	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
350	App Produtores SEMAPA	Aplicativo de cadastro de Produtores da zona rual de São Luís, assim como suas propriedades e produções, para controle da SEMAPA.	Aplicativo móvel para cadastrar e gerenciar informações sobre os produtores da zona rural de São Luís, suas propriedades e a produção, otimizando o controle e o fomento da SEMAPA	Servidores da SEMAPA	SEMAPA	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
351	BI Lista de espera SEMED	Página que exibe em tempo real a lista de espera de alunos para a matrícula, ordenados conforme critérios	Painel transparente que exibe a posição em tempo real de alunos na lista de espera por vagas na rede municipal de ensino, com classificação baseada em critérios predefinidos	Cidadão e gestores da SEMED	SEMED	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://transparenciabi.saoluis.ma.gov.br/extensions/SEMED_MAPA_MATRICULAS/SEMED_MAPA_MATRICULAS.html	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
352	BI Matrículas SEMED	Painel BI para exibir estatísticas das matrículas de alunos na rede municipal em 2024, puzando dados diretamente do sistema GEDUC	Painel de BI para a análise estatística dos dados de matrículas da rede municipal em 2024, extraindo informações diretamente do sistema GEDUC para apoiar o planejamento educacional	Gestores da SEMED	SEMED	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
353	Painel BI SEMED RH	Painel BI que exibe os dados de RH dos servidores da rede municipal de educação.	Painel analítico que consolida dados de Recursos Humanos dos servidores da educação municipal, oferecendo insights sobre o quadro de pessoal, lotação e dados funcionais	Gestores da SEMED	SEMED	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://bi.saoluis.ma.gov.br/sense/app/03f77d96-1889-4e20-a794-b7fdde81646c	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
354	Painel BI SEMFAZ	Painel BI que analisa os faturamentos temporais por CPF/CNPJ com acompanhamento de Notas Fiscais Emitidas e Canceladas	Ferramenta de BI para a análise de faturamento e arrecadação fiscal, permitindo o acompanhamento de Notas Fiscais emitidas e canceladas por contribuinte (CPF/CNPJ)	Gestores e auditores fiscais	SEMFAZ	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://bi.saoluis.ma.gov.br/sense/app/57f55af6-6b81-4181-9dfd-88074d76d858	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
355	Aplicativo De Olho na Cidade	Aplicativo que permite que os cidadãos façam denúncias e solicitem serviços públicos, de maneira prática e rápida, fortalecendo a participação cidadã na melhoria da gestão urbana da cidade de São Luís.	Aplicativo móvel que funciona como um canal direto entre o cidadão e a prefeitura, permitindo o envio de denúncias e solicitações de serviços urbanos, fortalecendo a participação social	Cidadão	SEMIT	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://play.google.com/store/apps/details?id=com.prefeituraslz.de_olho_na_cidade	0	0	0.00	0	t	https://play.google.com/store/apps/details?id=com.prefeituraslz.de_olho_na_cidade	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
356	SEI!	Implantação do Sistema Eletrônico de Informações (SEI!) na Prefeitura de São Luís. Se tornando o próximo sistema oficial de tramitação de processos. Incluindo a migração de dados, parametrizações, estruturação da infraestrutura de suporte	Plataforma oficial para a tramitação eletrônica de processos e documentos administrativos na Prefeitura, eliminando o uso de papel e modernizando os fluxos de trabalho	Servidores	SEMIT	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://saoluis.ma.gov.br/sei	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	TRF4 (Software público)
357	Sistema de Consulta do 1Doc Legado	Sistema de consulta do backup da base de dados do Sistema 1Doc, para manutenção do acesso aos processos legados mesmo após o fim da vigência do contrato com a empresa e a retirada do sistema do ar.	Sistema de arquivamento digital que permite a consulta ao banco de dados do antigo sistema 1Doc, garantindo o acesso a processos e documentos legados após o encerramento do contrato	Servidores	SEMIT	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://1doc-legado.saoluis.ma.gov.br/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
358	Cadastro Link Verde IMPUR/SEMMAM	Formulário de requsição do programa Link Verde, em parceria com o IMPUR e a SEMMAM. Programa onde o cidadão pode solicitar mudas de plantas e retirar nos pontos de entrega, no Parque do Bom Menino e na UEMA.	Formulário online para solicitação de mudas de plantas através do programa Link Verde, uma parceria entre IMPUR e SEMMAM para incentivar o plantio e a arborização na cidade	Cidadão	SEMMAM	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://saoluis.ma.gov.br/linkverde	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
359	AppSheet SEMURH Blitz Urbana Comércio Legal	Aplicativo para a Blitz Urbana gerenciar informações de comerciantes, base inicialmente utilizada para o sorteio das vagas do evento da virada de ano, mas que poderá ser utilizada em eventos futuros.	Aplicativo desenvolvido em AppSheet para gerenciar informações de comerciantes informais, utilizado para organizar sorteios de vagas em eventos e manter um cadastro atualizado	Fiscais da Blitz Urbana	SEMURH	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://www.appsheet.com/start/1bda1541-ee49-432e-9615-9a05655081b3	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
360	Pesquisa Habitacional	Pesquisa para SEMISPE e SEMAD saberem sobre o interesse dos servidores da prefeitura quanto a morarem na área do centro de são luís	Formulário de pesquisa online para avaliar o interesse dos servidores municipais em programas habitacionais na área central da cidade, fornecendo dados para o planejamento da SEMURH	Servidores	SEMURH	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
362	Cadastro Castramóvel SEMUS	Cadastro do programa Castramóvel da SEMUS, onde o cidadão pode inscrever o seu pet para castração gratuita, conforme região e vagas divulgadas.	Plataforma online para inscrição de animais de estimação no programa de castração gratuita da SEMUS, organizando a demanda por região e conforme a disponibilidade de vagas	Cidadão	SEMUS	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
363	Queridômetro HC	Aplicativo para avaliação de serviços por meio de emojis	Aplicativo de avaliação de satisfação que permite aos usuários de serviços públicos, como unidades de saúde, avaliarem o atendimento recebido de forma rápida e intuitiva, usando emojis	Cidadão	SEMUS	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://play.google.com/store/apps/details?id=com.prefeituraslz.queridometro_prefeitura_slz	0	0	0.00	0	t	https://play.google.com/store/apps/details?id=com.prefeituraslz.queridometro_prefeitura_slz	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
364	Sistema de Crachás SEMUS	Cadastro de Carteiras para Autistas e portadores de Fibromialgia. Emissão das carteiras conforme layout definido pela SEMUS.	Sistema para o cadastro e emissão da Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA) e da Pessoa com Fibromialgia, garantindo o atendimento prioritário	Cidadão	SEMUS	2024	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://cartaotea.saoluis.ma.gov.br/login/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
365	AppSheet SEMUSC Casarões e Áreas de Risco	Aplicativo para a Defesa Civil gerenciar as informações de casarões e as áreas de risco para acompanhamento.	Aplicativo em AppSheet para a Defesa Civil registrar, monitorar e gerenciar informações sobre casarões históricos e outras áreas de risco na cidade, otimizando as ações de prevenção	Agentes da Defesa Civil	SEMUSC	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://www.appsheet.com/start/a0487298-da08-4fb6-b0ee-5f78f2013a96	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
366	Consulta Pública Digital - Orçamento Participativo SEPLAN	Página de informações sobre o Orçamento Participativo e Formulário online para levantamento de informações referentes às demandas da população, com o objetivo de garantir a participação do cidadão na fase de elaboração dos Projetos de Lei,	Plataforma online para a participação popular na elaboração da Lei Orçamentária Anual (LOA), permitindo que os cidadãos enviem sugestões e indiquem prioridades de investimento para seus bairros	Cidadão	SEPLAN	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
368	Meu Ônibus	Página de divulgação do aplicativo Meu Ônibus	Página informativa para divulgar e centralizar os links de download do aplicativo "Meu Ônibus", que oferece informações sobre o transporte coletivo da cidade	Cidadão	SMTT	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
369	Appsheet Áreas Tombadas Defesa Civil	Ferramenta para registro e monitoramento de imóveis tombados, com apoio às ações da Defesa Civil.	Ferramenta móvel para registro e monitoramento de imóveis tombados, focada em apoiar as ações preventivas e de resposta rápida da Defesa Civil em caso de sinistros	Agentes da Defesa Civil	DC	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
370	Appsheet Patrimônio Presente - FUMPH	Aplicativo que realiza o registro e relatórios de presença dos professores e alunos no evento mensal "O patrimônio nas escolas" da FUMPH.	Aplicativo para registrar a frequência e gerar relatórios de participação de professores e alunos no evento mensal "O Patrimônio nas Escolas", otimizando a gestão do projeto	Servidores da FUMPH	FUMPH	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
372	Appsheet Concursos SEMAD	Aplicativo para controle e acompanhamento dos concursos públicos realizados pela SEMAD.	Aplicativo interno para o controle e acompanhamento de todas as etapas dos concursos públicos realizados pela Prefeitura, desde a publicação do edital até a homologação	Servidores da SEMAD	SEMAD	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
373	Appsheet Inspeção Sanitária SEMAPA	Aplicativo para coleta de dados de inspeções sanitárias em estabelecimentos.	Aplicativo para digitalizar o processo de inspeção sanitária, permitindo que os fiscais coletem dados, preencham checklists e gerem relatórios diretamente em campo	Fiscais sanitários da SEMAPA	SEMAPA	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
367	Painel BI SEPLAN	Painel BI para acompanhamento da execução do PPA da Prefeitura, para a SEPLAN. Informações advindas de diversas fontes são resumidas em indicadores para fácil avaliação do desempenho do cumprimento das metas estabelecidas.	Painel de BI para o acompanhamento da execução do Plano Plurianual (PPA) da Prefeitura, consolidando informações de diversas fontes para avaliar o cumprimento das metas estratégicas	Gestores da SEPLAN	SEPLAN	2024	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://bi.saoluis.ma.gov.br/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-10 13:44:30.70004	SEMIT - Equipe de Desenvolvimento Interno
377	BI Consulta de Renúncias SEMFAZ	Ferramenta de consulta a dados de incentivos fiscais e renúncias, promovendo transparência fiscal.	Ferramenta de transparência ativa que permite a consulta pública a dados de incentivos fiscais e renúncias de receita do município, detalhando os benefícios concedidos	Cidadãos, empresas e órgãos	SEMFAZ	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://transparenciabi.saoluis.ma.gov.br/extensions/CONSULTA_RENUNCIAS/CONSULTA_RENUNCIAS.html	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
378	Chatbot da Prefeitura	Assistente virtual disponível 24h para tirar dúvidas e facilitar o acesso a serviços municipais pelo WhatsApp e site oficial.	Assistente virtual inteligente, disponível 24/7 no site oficial e WhatsApp, programado para responder dúvidas frequentes e direcionar o cidadão para os serviços municipais corretos	Cidadão	SEMIT	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://saoluis.ma.gov.br	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
379	Site Institucional	Novo portal oficial da Prefeitura com visual moderno, navegação acessível e serviços otimizados para o cidadão.	Novo portal oficial da Prefeitura de São Luís, com design moderno, navegação intuitiva e foco em acessibilidade, funcionando como a principal porta de entrada para serviços e informações	Cidadão e Servidor	SEMIT	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://saoluis.ma.gov.br	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
380	Appsheet Gabinete SEMMAM	Aplicativo de apoio às atividades do gabinete da SEMMAM, otimizando a gestão e o monitoramento de demandas.	Aplicativo para otimizar a gestão de demandas internas do gabinete da SEMMAM, como o controle de ofícios, memorandos e o agendamento de reuniões.	Servidores do gabinete	SEMMAM	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
374	BI Produtores SEMAPA	Painel de BI para acompanhamento de produtores rurais e suas atividades.	Painel de Business Intelligence que apresenta visualmente os dados coletados pelo "App Produtores SEMAPA", permitindo a análise do perfil da produção rural no município	Gestores da SEMAPA	SEMAPA	2025	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://play.google.com/store/apps/details?id=br.gov.ma.saoluis.semapa_app	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
375	BI SAEV/SEAMA SEMED	Painel analítico com dados da rede escolar, integrando indicadores de avaliação e desempenho.	Painel analítico que cruza dados da rede escolar com indicadores de avaliações externas (ex: SAEB) e internas, oferecendo uma visão integrada sobre o desempenho dos alunos e das escolas	Gestores e equipe pedagógica	SEMED	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
376	Appsheet SEMEPED	Cadastro para gerenciar as atividades da SEMEPED	Aplicativo para gerenciar as atividades e atendimentos realizados pela SEMEPED, organizando o cadastro de pessoas com deficiência e o acompanhamento dos serviços oferecidos	Servidores da SEMEPED	SEMEPED	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
381	Appsheet Jurídico SEMMAM	Solução digital para organização e acompanhamento de processos jurídicos no âmbito da secretaria.	Solução digital para organizar e acompanhar o fluxo de processos e pareceres jurídicos no âmbito da SEMMAM, melhorando o controle de prazos e a gestão de documentos	Equipe jurídica da SEMMAM	SEMMAM	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
382	BI e Appsheet Autorizações Ambientais SEMMAM	Soluções digitais para controle e visualização das autorizações ambientais emitidas, com BI integrado	Solução integrada que utiliza um AppSheet para o controle interno dos processos de autorização ambiental e um painel de BI para dar transparência pública aos dados	Servidores da SEMMAM e cidadãos	SEMMAM	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://transparenciabi.saoluis.ma.gov.br/extensions/SEMMAM-LICENCAS/SEMMAM-LICENCAS.html	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
6	SAE - Selo e Autenticação	Autenticação de documentos digitais sem ICP-Brasil, via login e senha. 	Sistema de autenticação eletrônica que permite validar documentos digitais sem necessidade de certificado ICP-Brasil, utilizando apenas login e senha seguros. 	Cidadãos e servidores	SEMIT	2025	novidades	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://sae.saoluis.ma.gov.br/login	0	0	0.00	0	f		2025-08-06 10:30:00	2025-10-09 16:26:31.356747	SEMIT - Ashla Karina
2	Espaço TEA – Aplicativo Inclusivo	Aplicativo inclusivo para atendimento a crianças com TEA.	Aplicativo desenvolvido especialmente para facilitar o atendimento e acompanhamento de crianças com Transtorno do Espectro Autista (TEA).	Cidadãos	SEMUS	2024	novidades	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://www.saoluis.ma.gov.br/espacotea	3	8508	4.70	125	t	https://www.saoluis.ma.gov.br/espacotea	2025-09-16 14:38:21.193891	2025-10-09 16:26:31.356747	SEMIT - Felipe Brito
361	Sorteio dos endereços do Residencial Mato Grosso SEMURH	Sistema utilizado no sorteio dos endereços do Residencial Mato Grosso, do programa habitacional da SEMURH. O sistema foi executado localmente na máquina, porém há registro do uso na live divulgada.	Software desenvolvido para realizar o sorteio eletrônico e transparente dos endereços (unidades habitacionais) do Residencial Mato Grosso para as famílias contempladas pelo programa da SEMURH	Beneficiários do programa	SEMURH	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://www.youtube.com/watch?v=QXXsaejEAzg	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-10 13:19:37.526888	SEMIT - Equipe de Desenvolvimento Interno
371	Site do Carnaval SECOM	Portal com programação, mapas e serviços do Carnaval, facilitando o acesso a informações oficiais.	Portal oficial do Carnaval de São Luís, centralizando programação, mapas dos circuitos, informações sobre serviços e notícias para facilitar o acesso do público às informações do evento	Cidadão	SECOM	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://carnaval.saoluis.ma.gov.br/	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-10 13:19:37.526888	SEMIT - Equipe de Desenvolvimento Interno
12	Precatórios	Sistema de gerenciamento dos professores com direito ao recebimento do Rateio dos Precatórios e Juros do FUNDEF para a SEMED	Sistema dedicado à gestão e consulta das informações dos professores elegíveis para o recebimento do Rateio dos Precatórios e Juros do FUNDEF, garantindo transparência no processo para a SEMED	Professores da rede municipal	SEMED	2023	interno	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://precatoriofundef.saoluis.ma.gov.br/	0	0	0.00	0	f		2023-05-15 10:30:00	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
13	SGE	Auxiliamos no processo de contratação de sistema de gestão dos dados da educação para a SEMED	Plataforma completa para a gestão de dados educacionais da rede municipal, centralizando informações sobre matrículas, notas, frequência, corpo docente e administrativo	Servidores e docentes da SEMED, alunos e pais	SEMED	2023	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://semed.geduc.com.br/	0	0	0.00	0	f		2023-08-15 10:30:00	2025-10-09 16:26:31.356747	GEDUC
346	Carnaval de São Luís	Site para exibir as atrações do Carnaval de São Luís	Hotsite informativo criado para centralizar e divulgar todas as informações oficiais sobre a programação do Carnaval de São Luís, incluindo atrações, horários e locais dos eventos	Cidadão	SECOM	2024	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-10 13:25:54.42312	SEMIT - Equipe de Desenvolvimento Interno
387	Voucher 99 SMTT	Parceria com a 99 para oferecer transporte gratuito durante a greve de ônibus.	Ação emergencial em parceria com a empresa 99 para fornecer vouchers de transporte gratuito ou com desconto para a população durante períodos de paralisação do transporte coletivo	Usuários de transporte público	SMTT	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-10 13:46:45.49733	Parceria SMTT e 99
383	BI e Appsheet Licenças Ambientais SEMMAM	Soluções digitais para controle e visualização das licenças ambientais emitidas, com BI integrado	Solução integrada que utiliza um AppSheet para a gestão dos processos de licenciamento ambiental e um painel de BI para a consulta pública das licenças emitidas pela secretaria	Servidores da SEMMAM e cidadãos	SEMMAM	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://transparenciabi.saoluis.ma.gov.br/extensions/SEMMAM-AUTORIZACOES/SEMMAM-AUTORIZACOES.html	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
384	Aplicativo Regularização Fundiária (Reurb) SEMURH	Ferramenta digital que facilita o processo de regularização de imóveis urbanos	Ferramenta digital para facilitar e dar transparência ao processo de Regularização Fundiária Urbana (Reurb), permitindo que o cidadão acompanhe o andamento de seu processo	Cidadão	SEMURH	2025	cidadao	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	https://play.google.com/store/apps/details?id=br.gov.ma.saoluis.reurb_app	0	0	0.00	0	t	https://play.google.com/store/apps/details?id=br.gov.ma.saoluis.reurb_app	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
385	Appsheet Imóveis Vazios Blitz SEMURH	Aplicativo para mapeamento de imóveis vazios ou abandonados, auxiliando na gestão urbana.	Aplicativo para mapear e cadastrar imóveis vazios, subutilizados ou abandonados na cidade, fornecendo dados para políticas de habitação e planejamento urbano	Fiscais da Blitz Urbana	SEMURH	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
386	Appsheet Pesquisa Mirante SETUR	App para coleta de opiniões de turistas no Mirante, ajudando a aprimorar a experiência turística.	Aplicativo para a coleta de dados e opiniões de turistas que visitam o Mirante da Cidade, ajudando a SETUR a avaliar a experiência e identificar pontos de melhoria	Servidores da SETUR e cidadãos	SETUR	2025	inativos	f	f	https://i.postimg.cc/bNjkxY6C/MARCA-PREFS-VERTICAL.png	\N	0	0	0.00	0	f	\N	2025-10-09 14:14:50.941368	2025-10-09 16:26:31.356747	SEMIT - Equipe de Desenvolvimento Interno
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
11	SECOM	Secretaria Municipal de Comunicação	Responsavel pelas Comunicações	2025-10-02 21:54:27.226099	2025-10-02 21:54:27.226099
12	SETUR	Secretaria Municipal de Turismo	Responsavel pelo Turismo	2025-10-02 21:56:28.429771	2025-10-02 21:56:28.429771
13	SEMISPE	Secretaria Municipal de Inovação, Sustentabilidade e Projetos Especiais	Responsável pela Inovação, Sustentabilidade e Projetos Esperciais	2025-10-09 11:11:04.47431	2025-10-09 11:11:04.47431
14	SEMEPED	Secretaria Municipal Extraordinária da Pessoa Com Defíciência	Responsável pela Pessoa com Defíciência	2025-10-09 11:56:54.328352	2025-10-09 11:56:54.328352
15	SEMMAM	Secretaria Municipal de Meio Ambiente	Responsável pelo Meio Ambiente	2025-10-09 12:25:42.316358	2025-10-09 12:25:42.316358
16	FUMPH	Fundação Municipal de Patrimônio Histórico	Responsável pelo Patrimônio Histórico	2025-10-09 12:30:43.808856	2025-10-09 12:30:43.808856
17	PGM	Procuradoria Geral do Municipio		2025-10-09 12:32:12.504109	2025-10-09 12:32:12.504109
18	DC	Defesa Civil		2025-10-09 12:33:04.386489	2025-10-09 12:33:04.386489
19	SEMAD	Secretaria Municipal de Administração	Responsável pela Administração	2025-10-09 14:11:35.812158	2025-10-09 14:11:35.812158
20	SEMUSC	Secretaria Municipal de Segurança com Cidadania	Responsável pela Segurança e Cidadania	2025-10-09 14:13:00.863061	2025-10-09 14:13:00.863061
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
13	10	Cadastro e Categorização de Ações Governamentais	2025-10-02 22:18:09.676191
14	10	Monitoramento do andamento e status	2025-10-02 22:18:09.676191
15	11	Seleção da unidade do CRAS e do serviço desejado	2025-10-02 22:38:06.204149
16	11	Agendamento online de data e horário para atendimento	2025-10-02 22:38:06.204149
17	11	Confirmação e cancelamento de agendamentos	2025-10-02 22:38:06.204149
18	12	Consulta individual de elegibilidade e valores a receber	2025-10-02 23:07:13.778999
19	12	Gerenciamento da base de dados de beneficiários pela SEMED	2025-10-02 23:07:13.778999
20	12	Disponibilização de informações e comunicados oficiais	2025-10-02 23:07:13.778999
21	13	Gerenciamento de matrículas e transferências de alunos	2025-10-02 23:07:13.778999
22	13	Registro de notas, faltas e diário de classe eletrônico	2025-10-02 23:07:13.778999
23	13	Módulo de gestão de recursos humanos (professores e servidores)	2025-10-02 23:07:13.778999
24	14	Mapeamento do fluxo de processos (As-Is)	2025-10-02 23:07:13.778999
25	14	Modelagem de novos fluxos otimizados (To-Be)	2025-10-02 23:07:13.778999
26	14	Geração de documentação e manuais de procedimentos	2025-10-02 23:07:13.778999
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

SELECT pg_catalog.setval('public.digital_systems_id_seq', 434, true);


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

SELECT pg_catalog.setval('public.system_features_id_seq', 26, true);


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
-- TOC entry 4806 (class 1259 OID 16499)
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
-- TOC entry 4811 (class 1259 OID 16498)
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
-- TOC entry 4819 (class 2606 OID 16505)
-- Name: digital_systems digital_systems_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_systems
    ADD CONSTRAINT digital_systems_category_fkey FOREIGN KEY (category) REFERENCES public.categories(code);


--
-- TOC entry 4820 (class 2606 OID 16500)
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


-- Completed on 2025-10-10 18:04:17

--
-- PostgreSQL database dump complete
--

\unrestrict pKs8wjhmXlyNGy1F5v9ZgOgFYoYCAlwyVvSxaN4dM80KkHVic0VCusmA8IXtpW7

