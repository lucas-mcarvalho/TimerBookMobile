# TimerBook Mobile

Aplicativo mobile do TimerBook feito com React Native e Expo.

## Funcionalidades

- Login e cadastro de usuario.
- Configuracao da URL do backend.
- Home com estatisticas gerais de leitura.
- Biblioteca do usuario.
- Cadastro e exclusao de livros.
- Inicio e finalizacao de sessoes de leitura com cronometro.
- Atualizacao da meta diaria de leitura.

## Como rodar

Instale as dependencias:

```bash
npm install
```

Rode o Expo:

```bash
npm start
```

Depois abra no emulador Android, iOS ou no app Expo Go.

## URL do backend

O app tenta usar estes enderecos por padrao:

- Android Emulator: `http://10.0.2.2:8080`
- iOS Simulator/Web: `http://localhost:8080`

Voce tambem pode criar um arquivo `.env` local a partir do exemplo:

```bash
cp .env.example .env
```

Depois ajuste `EXPO_PUBLIC_API_URL` no `.env`. Esse arquivo local fica fora do Git.

Em celular fisico, use o IP da sua maquina na mesma rede, por exemplo:

```text
http://192.168.0.10:8080
```

Tambem da para salvar esse endereco na tela de login ou na aba Perfil.

## URL do leitor web

O leitor de PDF roda dentro de um WebView usando o front-end web. Se
`EXPO_PUBLIC_WEB_URL` nao estiver configurada, o app usa o mesmo host da API e
troca a porta para `5173`. Exemplo: com `EXPO_PUBLIC_API_URL=http://192.168.0.10:8080`,
o leitor tenta abrir `http://192.168.0.10:5173`.

Se o Vite estiver em outra porta, configure a URL do leitor no `.env`:

```text
EXPO_PUBLIC_WEB_URL=http://192.168.0.10:5173
```

Use o mesmo IP em `EXPO_PUBLIC_API_URL`, em `VITE_API_BASE_URL` no front-end web,
e no `cors.originPatterns` do backend, incluindo a porta exata do Vite. Ao rodar
o Vite para acessar pelo celular, inicie com host aberto na rede, por exemplo:

```bash
npm run dev -- --host 0.0.0.0
```

## Credenciais

Credenciais reais nao devem ser commitadas. O repositorio deve ter apenas arquivos de exemplo, como `.env.example`, e cada pessoa cria o proprio `.env` depois de clonar.

No app Expo, variaveis com `EXPO_PUBLIC_` entram no bundle e devem ser tratadas como publicas. Segredos de verdade ficam no backend, no gerenciador de senhas da equipe, no GitHub Secrets ou no EAS Secrets.

## Observacoes

O backend precisa estar rodando antes do login. Se estiver usando Docker Compose pela raiz do projeto, suba os containers primeiro:

```bash
docker-compose up --build
```
