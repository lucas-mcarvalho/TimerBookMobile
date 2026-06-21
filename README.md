<div align="center">
  <h1>TimerBook Mobile</h1>

  <p>
    Aplicativo mobile do TimerBook para organizar livros, acompanhar metas de leitura
    e acessar a experiencia de leitura pelo celular.
  </p>
</div>

## Sobre o Projeto

O TimerBook Mobile e a versao para dispositivos moveis da plataforma TimerBook. O
app foi desenvolvido com React Native e Expo para permitir que o usuario faca login,
acompanhe sua biblioteca, cadastre livros, inicie sessoes de leitura, visualize
estatisticas e ajuste sua meta diaria diretamente pelo celular.

Este repositorio complementa o projeto principal do TimerBook, que contem o backend,
o front-end web, a landing page e os demais servicos da aplicacao.

## Links

| Recurso | Acesso |
|---------|--------|
| Deploy da aplicacao web | [timerbook.com.br](http://timerbook.com.br) |
| Landing page | [TimerBook Landing Page](https://lucas-mcarvalho.github.io/TimerBook_PS/) |
| Video do projeto | [Assistir no YouTube](https://www.youtube.com/watch?v=RutJxCjv6bo) |
| Planejamento no Trello | [Trello TimerBook](https://trello.com/b/HtVptYfz/timerbook) |
| User Stories e prototipo | [Figma TimerBook](https://www.figma.com/design/dgX72w2shMIYEC9jvOFopp/TimerBook?node-id=1-5&p=f&t=HIWQvvAN6rVbJlLf-0) |
| Repositorio principal | [TimerBook_PS](https://github.com/lucas-mcarvalho/TimerBook_PS) |
| Repositorio mobile | [TimerBookMobile](https://github.com/lucas-mcarvalho/TimerBookMobile) |

## Tecnologias

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="50" title="JavaScript" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" width="50" title="React Native" alt="React Native" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original-wordmark.svg" width="50" title="Android" alt="Android" />
</p>

- JavaScript
- React Native
- Expo
- AsyncStorage
- React Native WebView
- React Native SVG
- React Native Chart Kit

## Principais Funcionalidades

- Login e cadastro de usuario.
- Configuracao da URL do backend pelo ambiente ou pelo proprio app.
- Home com resumo de leitura e atalhos principais.
- Biblioteca pessoal com listagem dos livros cadastrados.
- Cadastro e exclusao de livros.
- Inicio e finalizacao de sessoes de leitura.
- Leitor integrado via WebView conectado ao leitor web do TimerBook.
- Estatisticas de leitura.
- Atualizacao da meta diaria de leitura.

## APK

Quando o APK for disponibilizado no repositorio, ele deve ficar na raiz com o nome:

```text
timerbook.apk
```

Esse arquivo serve para instalacao direta em dispositivos Android, sem precisar
rodar o projeto localmente com Expo.

Para instalar:

1. Baixe o arquivo `timerbook.apk` deste repositorio.
2. Envie o arquivo para um celular Android ou baixe diretamente pelo navegador do aparelho.
3. Abra o APK no Android.
4. Se o sistema bloquear a instalacao, habilite a permissao para instalar apps de fontes desconhecidas.
5. Conclua a instalacao e abra o app TimerBook.

Observacao: o app continua dependendo da API do TimerBook. Para login, cadastro,
biblioteca e leitura funcionarem, o backend precisa estar disponivel e a URL da API
precisa estar correta.

## Equipe

| Nome | Perfil GitHub |
|------|---------------|
| Tiago Barbosa de Castro Souza | [TiagoBrs](https://github.com/TiagoBrs) |
| Vitor Kawan Barbosa Borges | [KawanVitor1](https://github.com/KawanVitor1) |
| Lucas Monteiro de Carvalho | [lucas-mcarvalho](https://github.com/lucas-mcarvalho) |
| Matheus Silva Pontes | [matheuspontes01](https://github.com/matheuspontes01) |
| Bruno Henrique Frota Sobral | [Bruno-uft](https://github.com/Bruno-uft) |
| Kayk Zago Pinheiro | [kayke002](https://github.com/kayke002) |

## Informacoes Academicas

**Curso:** Ciencia da Computacao

**Professor:** Dr. Edeilson Milhomem

## Estrutura do Projeto

```text
TimerBookMobile/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── package-lock.json
├── timerbook.apk        # APK de instalacao, quando disponibilizado
├── src/
│   ├── api/
│   ├── components/
│   ├── screens/
│   └── utils/
└── README.md
```

## Configuracao do `.env`

O projeto usa variaveis publicas do Expo. Para configurar o ambiente local, copie
o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois ajuste a URL da API:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

Variaveis com o prefixo `EXPO_PUBLIC_` entram no bundle do app e devem ser tratadas
como publicas. Nao coloque senhas, tokens privados ou chaves secretas no `.env` do
mobile. Segredos reais devem ficar no backend, no GitHub Secrets, no EAS Secrets ou
em outro gerenciador seguro.

### URLs comuns para desenvolvimento

| Ambiente | URL sugerida |
|----------|--------------|
| Android Emulator | `http://10.0.2.2:8080` |
| iOS Simulator ou web | `http://localhost:8080` |
| Celular fisico na mesma rede | `http://IP_DA_SUA_MAQUINA:8080` |

Exemplo para celular fisico:

```text
http://192.168.0.10:8080
```

Tambem e possivel salvar ou alterar o endereco do backend dentro do app, pela tela
de login ou pela aba Perfil.

## Como Rodar o Projeto

### Pre-requisitos

- Git
- Node.js
- npm
- Expo
- Backend do TimerBook rodando

### Passos

1. Clone o repositorio:

```bash
git clone https://github.com/lucas-mcarvalho/TimerBookMobile.git
```

2. Acesse a pasta do projeto:

```bash
cd TimerBookMobile
```

3. Instale as dependencias:

```bash
npm install
```

4. Configure o `.env` com a URL da API:

```bash
cp .env.example .env
```

5. Inicie o Expo:

```bash
npm start
```

6. Abra o app no Android Emulator, iOS Simulator, navegador ou no aplicativo Expo Go.

Tambem existem scripts especificos:

```bash
npm run android
npm run ios
npm run web
npm run start:lan
npm run start:tunnel
```

## Backend

O aplicativo mobile depende da API do TimerBook. Para rodar o backend localmente,
use o repositorio principal:

```bash
git clone https://github.com/lucas-mcarvalho/TimerBook_PS.git
cd TimerBook_PS
docker compose up --build
```

Apos subir o backend, ajuste `EXPO_PUBLIC_API_URL` no app mobile conforme o ambiente
em que voce esta testando.
