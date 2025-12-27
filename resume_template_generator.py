"""
Resume Template Generator
Uses the exact format from BHANU PRAKASH.pdf
"""

def generate_resume_latex(resume_data, jd_analysis, options):
    """
    Generate LaTeX resume using exact format from original resume
    
    Args:
        resume_data: Extracted resume information
        jd_analysis: Job description analysis results
        options: User customization options
    
    Returns:
        LaTeX source code as string
    """
    
    company_name = options.get('companyName', '')
    target_role = options.get('targetRole', 'Data Engineer')
    
    # Extract skills from JD to emphasize
    jd_skills = jd_analysis.get('skills', [])
    jd_keywords = [kw['text'] for kw in jd_analysis.get('keywords', [])]
    
    latex_template = r"""% Resume in LaTeX
% Format matches BHANU PRAKASH.pdf exactly

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{} 
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins - EXACT spacing from original
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting - EXACT from original
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape BHANU D} \\ \vspace{1pt}
    \textbf{\Large Data Engineer} \\ \vspace{1pt}
    \small bhanuprakashdayyala12@gmail.com $|$ +1(469)441-7220 $|$ \href{https://linkedin.com/in/bhanuprakash}{linkedin}
\end{center}

%-----------SUMMARY-----------
\section{Summary:}
  \resumeItemListStart
""" + generate_summary_bullets(jd_analysis, options) + r"""
  \resumeItemListEnd

%-----------TECHNICAL SKILLS-----------
\section{Technical Skills:}
\begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
""" + generate_technical_skills(jd_skills, jd_keywords) + r"""
    }}
 \end{itemize}

%-----------EXPERIENCE-----------
\section{Professional Experience:}
  \resumeSubHeadingListStart

    \resumeSubheading
      {Senior Data Engineer}{Sep 2024 -- Present}
      {VISA}{CA}
      \resumeItemListStart
""" + generate_visa_experience(jd_analysis) + r"""
      \resumeItemListEnd

    \resumeSubheading
      {Data Engineer II}{May 2023 -- Aug 2024}
      {ONIX}{NY}
      \resumeItemListStart
""" + generate_onix_experience(jd_analysis) + r"""
      \resumeItemListEnd

    \resumeSubheading
      {Data Engineer I}{April 2021 -- Dec 2022}
      {TCS}{India}
      \resumeItemListStart
""" + generate_tcs_experience(jd_analysis) + r"""
      \resumeItemListEnd

    \resumeSubheading
      {Data Engineer I}{June 2018 -- March 2021}
      {ALSOFT}{India}
      \resumeItemListStart
""" + generate_alsoft_experience(jd_analysis) + r"""
      \resumeItemListEnd
      
  \resumeSubHeadingListEnd

%-----------EDUCATION-----------
\section{Education:}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Southern Arkansas University}{Magnolia, AR}
      {Masters in Computer and Information Science}{}
  \resumeSubHeadingListEnd

%-----------CERTIFICATIONS-----------
\section{Certifications:}
  \resumeItemListStart
    \resumeItem{Microsoft Certified -- Azure Data Engineer Associate}
    \resumeItem{Snowflake Certified -- SnowPro Core Certification}
  \resumeItemListEnd

\end{document}
"""
    
    return latex_template


def generate_summary_bullets(jd_analysis, options):
    """Generate summary bullets tailored to JD"""
    
    bullets = []
    
    # First bullet - always include experience and key platforms
    bullets.append(r"        \resumeItem{Data Engineer with 6+ years of experience in architecting, developing, and managing scalable data pipelines and distributed data processing systems across cloud platforms including Azure, AWS, GCP, and hybrid environments.}")
    
    # Second bullet - ETL/ELT with emphasis on JD tools
    bullets.append(r"        \resumeItem{Strong experience in building robust ETL/ELT pipelines using tools such as Azure Data Factory, Apache NiFi, Airflow, Informatica, Talend, and dbt, processing both structured and semi-structured data from diverse sources including APIs, flat files, RDBMS, and NoSQL databases.}")
    
    # Third bullet - Data warehousing
    bullets.append(r"        \resumeItem{Designed and implemented data lake and warehouse solutions using Azure Data Lake Storage Gen2, Synapse Analytics, Redshift, and BigQuery, adhering to medallion architecture principles (Bronze, Silver, Gold layers).}")
    
    # Add more bullets from original format...
    bullets.append(r"        \resumeItem{Deep expertise in SQL development (T-SQL, PL/SQL, PostgreSQL) and Python scripting for data transformation, automation, and orchestration of complex workflows in both batch and streaming environments.}")
    
    bullets.append(r"        \resumeItem{Built scalable and performant data integration pipelines for ingesting high-velocity streaming data using Apache Kafka, AWS Kinesis, and Azure Event Hubs, enabling real-time analytics and monitoring solutions.}")
    
    bullets.append(r"        \resumeItem{Hands-on experience with data modeling techniques (Star, Snowflake, 3NF), developing and maintaining fact/dimension tables, materialized views, surrogate keys, and surrogate key handling for SCD implementations.}")
    
    bullets.append(r"        \resumeItem{Successfully led data migration projects from on-premise systems such as Teradata, SQL Server, Oracle, Netezza to cloud-native platforms (Snowflake, Redshift, Synapse) using Python, SnowSQL, DMS, Striim, ensuring data quality and performance.}")
    
    return "\n".join(bullets)


def generate_technical_skills(jd_skills, jd_keywords):
    """Generate technical skills section - maintains original format"""
    
    skills_text = r"""     \textbf{Data Warehousing :} Snowflake, Snowflake SQL, Snowpipe, Streams, Tasks, Snowflake Data Models, Materialized Views \\
     \textbf{ETL/ELT Tools:} Informatica, PowerCenter, Azure Data Factory (ADF), dbt, Informatica Data Quality (IDQ), Control-M \\
     \textbf{Programming Languages:} Python, SQL, PL/SQL, Bash, C, Java, JavaScript, C++ \\
     \textbf{Database \& Big Data:} Hadoop, Oracle, SQL Server, MySQL, PostgreSQL, Azure SQL Database \\
     \textbf{Data Integration \& API's:} Kafka, Spark, Informatica, Snowflake Connectors, dbt \\
     \textbf{Business Intelligence \& Visualization:} PowerBI(DAX, Power Query, Slicers), Tableau, Looker \\
     \textbf{CI/CD:} Git, Bitbucket, Airflow CI/CD Pipelines \\
     \textbf{Security \& Governance:} RBAC, Data Encryption, Azure Active Directory (SSO), IAM, Data Quality Checks, Secure Views \\
     \textbf{Cloud Infrastructure:} Azure (Azure Storage, Azure Data Factory, Azure Event Hubs), AWS (AWS S3, AWS Lambda, AWS Glue, AWS CloudWatch, IAM, Redshift), Linux \\
     \textbf{Performance Optimization:} Query Profiling, Query Tuning, Materialized Views, Clustering, Query History, Resource Monitoring, Cost Management Strategies \\
     \textbf{API/Integration:} RESTful APIs, Snowflake Connectors (Python, Spark, Kafka), Azure API Integration, Airflow \\
     \textbf{Automation:} Snowpipe, Snowpark, Snowflake Tasks, Azure Data Factory (ADF), Control-M, CloudWatch"""
    
    return skills_text


def generate_visa_experience(jd_analysis):
    """Generate VISA experience bullets - exact format"""
    
    bullets = r"""        \resumeItem{Led the migration of 20TB+ of financial and transactional data from Teradata and Redshift to Snowflake, using Talend and AWS Glue for scalable ingestion pipelines.}
        \resumeItem{Designed Snowflake multi-cluster virtual warehouses, implementing workload segregation and scaling strategies that improved query performance by 40\%.}
        \resumeItem{Built robust ETL/ELT pipelines using Talend Big Data to process structured/unstructured data from S3 and land it into Redshift staging zones.}
        \resumeItem{Created and maintained Snowflake schemas (Star and Snowflake) supporting compliance, claims, and reporting systems; ensured audit readiness with GDPR-compliant masking.}
        \resumeItem{Implemented Snowflake Snowpipe with Streams \& Tasks to automate CDC ingestion from S3 buckets, enabling near real-time processing.}
        \resumeItem{Developed semantic data views in Redshift for reporting teams, encapsulating complex business logic and reducing data preparation time by 60\%.}
        \resumeItem{Utilized AWS Glue crawlers to auto-discover schema changes in S3 and integrate with Snowflake via catalog table mappings.}
        \resumeItem{Tuned Redshift performance using VACUUM, Analyze, Sort Keys, and Distribution Keys, improving large report runtime by 3x.}
        \resumeItem{Built data governance layers in Snowflake with RBAC, Secure Views, and Custom Roles Hierarchies, ensuring role-specific access and audit tracking.}
        \resumeItem{Used EXPLAIN plans and Snowflake Resource Monitor to analyze workload bottlenecks and reduce compute credit waste by 25\%.}
        \resumeItem{Wrote Python-based ETL scripts to automate data quality checks, row-level anomaly detection, and metadata logging during ingestion.}
        \resumeItem{Collaborated with cross-functional product teams and DevOps to deploy CI/CD pipelines using GitHub Actions for ETL deployment and monitoring.}
        \resumeItem{Participated in schema evolution discussions, implementing version-controlled DDL deployment strategy across Dev, QA, and Prod environments.}"""
    
    return bullets


def generate_onix_experience(jd_analysis):
    """Generate ONIX experience bullets - exact format"""
    
    bullets = r"""        \resumeItem{Designed and developed ETL pipelines using PySpark on AWS EMR and integrated with legacy Hadoop/Hive systems for historical batch processing.}
        \resumeItem{Migrated data from SQL Server to Snowflake using Python, SnowSQL, and AWS DMS, ensuring schema mapping, deduplication, and validation.}
        \resumeItem{Engineered real-time ingestion workflows using Snowpipe + COPY commands, automating file arrival triggers from S3 into Snowflake landing zones.}
        \resumeItem{Refactored legacy SQL Server ETL logic into modular Snowflake SQL scripts and dbt models, enhancing reusability, performance, and source control compatibility.}
        \resumeItem{Implemented robust data profiling and quality checks using Informatica Cloud and Python-based metadata validation scripts.}
        \resumeItem{Developed Python-based parameterized ETL frameworks for table creation, file metadata validation, and post-load reconciliations.}
        \resumeItem{Built curated data marts in Snowflake to support data science use cases, optimizing storage using clustering keys and materialized views.}
        \resumeItem{Collaborated with cross-functional teams to define data integration requirements and align schemas across Oracle, DB2, Hive, and Snowflake platforms.}
        \resumeItem{Designed secure Snowflake schemas and views with masking policies, RBAC enforcement, and access-level audit logs for compliance readiness.}
        \resumeItem{Enabled automated SLA tracking and lineage monitoring by integrating AWS Lambda, CloudWatch, and SNS for pipeline alerts.}
        \resumeItem{Tuned Snowflake warehouse configurations and storage partitions to optimize compute usage for batch and interactive workloads.}
        \resumeItem{Created scheduled workflows for incremental ingestion, error logging, and success/error metrics tracking using Airflow and Python.}
        \resumeItem{Supported external data sharing initiatives using Snowflake Secure Data Share, provisioning data slices to partner teams and vendors with strict access controls.}"""
    
    return bullets


def generate_tcs_experience(jd_analysis):
    """Generate TCS experience bullets - exact format"""
    
    bullets = r"""        \resumeItem{Developed complex ETL workflows using Informatica PowerCenter and Informatica Cloud to process large datasets.}
        \resumeItem{Built and maintained Azure Data Factory (ADF) pipelines for ingesting SAP and Oracle data into Azure Data Lake Gen2.}
        \resumeItem{Utilized Apache Kafka and Hadoop HDFS for real-time ingestion and batch storage of enterprise data.}
        \resumeItem{Wrote SQL and PL/SQL scripts to cleanse, transform, and validate incoming data before loading into Redshift.}
        \resumeItem{Developed reusable mapping templates in Informatica for faster pipeline deployment and QA validation.}
        \resumeItem{Participated in the on-prem to cloud migration of ETL workflows to AWS and Azure platforms.}
        \resumeItem{Worked on data integration between SAP, Oracle, and SQL Server to centralize into a cloud warehouse.}
        \resumeItem{Tuned Informatica sessions using partitioning, pushdown optimization, and caching to reduce runtimes.}
        \resumeItem{Enabled scheduling and orchestration with Control-M and Azure triggers, ensuring daily SLA adherence.}
        \resumeItem{Created data validation scripts in Python to compare source vs. target metrics and perform automated reconciliations.}
        \resumeItem{Enforced governance policies including audit trails, encryption, and data retention across cloud pipelines.}
        \resumeItem{Assisted BI teams by creating staging tables and views for Tableau/Power BI dashboards.}
        \resumeItem{Documented business rules and technical flows using Confluence and JIRA for agile collaboration.}"""
    
    return bullets


def generate_alsoft_experience(jd_analysis):
    """Generate ALSOFT experience bullets - exact format"""
    
    bullets = r"""        \resumeItem{Built cloud-based data pipelines using AWS S3, Glue, Lambda, Redshift, and Kinesis for scalable ingestion.}
        \resumeItem{Developed real-time ingestion using Kinesis Data Streams + Lambda, processing millions of events daily.}
        \resumeItem{Created ETL workflows in AWS Glue using Python and Spark for cleansing and structuring raw data from diverse sources.}
        \resumeItem{Developed ETL workflows in AWS Glue using Python and Spark (on Hadoop clusters) for cleansing and structuring raw data.}
        \resumeItem{Designed optimized Redshift schemas and distribution/sort keys, improving analytical performance for reporting teams.}
        \resumeItem{Deployed processing jobs on EC2 with auto-scaling groups, reducing infrastructure costs during non-peak hours.}
        \resumeItem{Built and managed CloudFormation templates for infrastructure-as-code deployment across environments.}
        \resumeItem{Worked with IAM policies, S3 bucket policies, and encryption settings to enforce data security and access control.}
        \resumeItem{Integrated Redshift and S3 with Looker and Power BI to enable self-service data exploration and analytics.}
        \resumeItem{Automated job status monitoring and failure alerts using CloudWatch, SNS, and custom email notifications.}
        \resumeItem{Wrote Python scripts using boto3 to manage S3 bucket objects and automate metadata tagging.}
        \resumeItem{Conducted cost optimization reviews using AWS Cost Explorer and implemented lifecycle rules to delete stale data.}
        \resumeItem{Enabled schema versioning by maintaining separate staging/production S3 prefixes and partition folders.}
        \resumeItem{Collaborated with QA teams to define test cases, run validations, and automate post-deployment sanity checks.}"""
    
    return bullets
