# Etapa 1: Construcción (Builder)
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./

# Instalamos las dependencias normales
RUN npm install --legacy-peer-deps

# --- PARCHE ---
# Instalamos explícitamente ajv@8 para corregir el error "Cannot find module 'ajv/dist/compile/codegen'"
# Esto fuerza a que webpack encuentre la versión moderna que necesita.
RUN npm install ajv@8
# --------------

COPY . .

# Variable de entorno para la API URL (se pasa en build time)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Ahora sí, compilamos
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
