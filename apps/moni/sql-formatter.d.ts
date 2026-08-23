declare module "sql-formatter" {
	export interface FormatOptions {
		language?:
			| "postgresql"
			| "mysql"
			| "mariadb"
			| "sqlite"
			| "sql"
			| "bigquery"
			| "db2"
			| "db2i"
			| "hive"
			| "n1ql"
			| "plsql"
			| "redshift"
			| "singlestoredb"
			| "snowflake"
			| "spark"
			| "transactsql"
			| "trino";
		tabWidth?: number;
		useTabs?: boolean;
		keywordCase?: "upper" | "lower" | "preserve";
		linesBetweenQueries?: number;
	}

	export function format(query: string, options?: FormatOptions): string;
}
