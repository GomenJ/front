# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

-- Errores

> [!CAUTION]
> Fix all these errors

- [x] Excel modificado
- [x] Fix price and basis price
- [x] Enviar los datos del PDF
- [x] Fix index from Henry
- [x] Periodo máximo 24 meses
- [x] Corregir, solo periodos de 6, 12, 18, 24 meses
- [x] No valores negativos ni de 0
- [?] Los valores incorrectos
- [?] un mes mas
- [?] formato de miles
- [x] Cargar datos en boton
- [?] 4 decimales hacia la alza, cuarto es el que sube
- [x] inicio de la coberta en pdf
- [ ] imprimir pdf, modificar cotización, nueva cotización
- [ ] Check list para checar o verificar los datos de un pdf
- [x] Titulo de pricing
- [x] Cambiar steps
- [x] Agregar indice al pdf
- [ ]
- [ ] Ustedes sí pueden ver las tables con indices
- [x] El indice de la tabla solo poner contra que va
- [x] 3 cifrás calculo en el pdf calculo
- [x] Agregar table de fees al calcular la cotización de gas
- [x] Invalid time checar
- [x] Validar fees y mostrar el original, fee y fee con comisión
- [x] Generar PDF con nombre de cliente, fecha forward `At3_2025-02-25.pdf`
- [x] Bloquear todas las fechas excepto actual si es que existe
- [ ] Otro rol para comercial para que no se vea la comision
- [x] Checar letras y chart

---

- [x] Periodo de la cobertura (meses)
- [x] Cambiar placeholder por luxem
- [x] Eliminar el cache, era autocomplete
- [x] Precio promedio sería precio fijo a contratar
- [x] En precio de garantía (USD)
- [ ] Fondo blanco
- [ ] Botón de descargar pdf customizar
- [ ] Comisión

---

## Despues

- [ ] Modificar chart y fonts
- [ ] Agregar formato para powerpoint

// Future
-- add fee for platform

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
