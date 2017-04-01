<div align="center">

# Bot Citador para Discord

Cite outros usuários do Discord usando comandos.

![demo GIF](https://raw.githubusercontent.com/kelvinss/node-discord-quoter-bot/master/readme/pt_demo.gif)

</div>


### Como funciona

Para utilizar o bot basta enviar mensagens iniciando com o comando `$q` e o ID da mensagem a ser citada. O ID é obtido no menu de contexto da mensagem após habilitar o modo de desenvolverdor (_Configurações > Aparência > Modo de Desenvolvedor_).

<div align="center">

![ID da mensagem](https://raw.githubusercontent.com/kelvinss/node-discord-quoter-bot/master/readme/pt_id.png)  
_Obtendo o ID da mensagem_

</div>

Comando: `$q 297771527494172672 resposta`

<div align="center">

![resposta](https://raw.githubusercontent.com/kelvinss/node-discord-quoter-bot/master/readme/pt_reply.png)  
_Resultado_
</div>

## Criando bot e obtendo token de acesso

* Crie um bot na [dashbord do Discord](https://discordapp.com/developers/applications) e [obtenha o token de acesso](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&amp;-getting-a-token)
* Obtenha o token de acesso da sua própria conta
  * Aperte `Ctrl+Shift+I` no seu Discord selecione a aba `Applications`, no alto. (caso  não apareça, clicar na seta `»`
  * Abra o local `Local Storage` e procure pelo item chamado "token", na lista.

### Como configurar no Heroku (nuvem)
* Crie e logue em sua conta em [heroku.com](https://signup.heroku.com/)
* Clique no botão "Deploy to Heroku" (ou [neste link](https://heroku.com/deploy))
* Dê um nome qualquer para seu app do Heroku
* Informe as variáveis de configuração:
  * `DISCORD_BOT_TOKEN`: o token do bot obtido na dashboard no discord
  * `DISCORD_USER_TOKEN`: o token da sua conta
  * `LOCALE`:  substituir "en" por "pt-BR"
  * `PREFIX`: prefixo do comando, o padrão é `$`
* Deploy


OBS.: uma conta gratuita no Heroku recebe 550 horas por mês, o que não é suficiente para rodar um aplicativo o mês inteiro. Para aumentar para 1000 horas basta [verificar um cartão de crédito](https://devcenter.heroku.com/articles/account-verification#how-to-verify-your-heroku-account) (sem pagar nada).

### Instalando localmente

* Instalar o [Node.js](https://nodejs.org/en/download/current/) (versão acima de **6.0.0**)
* Clonar ou [baixar o zip](https://github.com/kelvinss/node-discord-quoter-bot/archive/master.zip) e extrair

[EM CONSTRUÇÃO]
