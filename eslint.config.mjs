import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
	{
		ignores: ["src/generated/**"],
	},
	...nextVitals,
	...nextTypeScript,
];

export default config;
