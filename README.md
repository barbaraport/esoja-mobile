# :vibration_mode: eSoja app :seedling:
## :running_woman: Como rodar o aplicativo

Primeiramente, clone o repositório. Atente-se sobre o caminho do clone dentro da sua máquina. Evite que quaisquer pastas tenham caracteres especiais e espaços no nome. Depois, siga os seguintes passos:

## Android :robot:

1. Instale o JDK (Java Development Kit). Recomendamos utilizar o [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html). Talvez seja necessário reiniciar o computador para que a instalação seja reconhecida.
2. Instale o NodeJS. Talvez seja necessário reiniciar o computador para que a instalação seja reconhecida.
3. Crie a variável de ambiente, para o sistema, chamada ```JAVA_HOME```. Nela terá o caminho em que o JDK está instalado. Exemplo: ```C:\Program Files\Java\jdk-15.0.2```.
4. Adicione o caminho ```C:\Program Files\Java\jdk-15.0.2\bin``` (não se esqueça de verificar a versão do seu JDK) a uma variável chamada ```Path```, já existente, nas variáveis de sistema. Crie uma nova linha (:warning: cuidado para não alterar os caminhos já existentes :warning:) Esse passo faz com que comandos do Java sejam reconhecidos no terminal.
5. Digite ```java --version``` no terminal para ver se tudo está configurado corretamente. Caso não funcione mesmo assim, reinicie o computador para ter certeza que tudo foi aplicado. Se mesmo assim não funcionar, verifique se você configurou corretamente as variáveis nos passos anteriores.
6. Instale o Android Studio para obter o SDK necessário para a execução do *app* em um dispositivo móvel.
7. Crie uma variável de ambiente para o sistema, chamada de `ANDROID_HOME`. Seu valor deve ser o caminho do SDK do Android dentro do seu computador. Exemplo: `C:\Users\seu-nome-de-usuario\AppData\Local\Android\Sdk`.
8. Adicione o caminho `C:\Users\seu-nome-de-usuario\AppData\Local\Android\Sdk\platform-tools` a uma variável chamada ```Path```, já existente, nas variáveis de sistema. Crie uma nova linha (:warning: cuidado para não alterar os caminhos já existentes :warning:). Esse passo faz com que o comando `adb devices` seja reconhecido no terminal. Assim, ao conectar o seu celular via USB é possível ver se ele é reconhecido como um dispositivo apto a executar o *app* ou não.
9. Nas configurações de desenvolvedor do seu dispositivo móvel, ative a opção `Depuração USB` para que o *app* possa ser reconhecido pelo `adb` e possa ser instalado no seu celular via USB. Um dos membros da nossa equipe, devido a personalizações do Android, precisou ativar mais configurações disponíveis sobre a `Instalação via USB` para que o *app* fosse instalado com sucesso. Verifique todas as opções disponíveis nas configurações de desenvolvedor do seu celular.
10. Abra a pasta `\esoja-mobile\` no Visual Studio Code. Essa pasta é correspondente ao projeto *React Native* do aplicativo *mobile*.
11. No terminal, execute o comando ```npm install``` para instalar todas as dependências do *app*, talvez seja necessário adicionar ao comando `--legacy-peer-deps` ou `--force`.
12. Um outro detalhe para que você tenha a experiência completa: é necessário [executar o back-end  das funcionalidades antigas do app em uma nova versão](https://github.com/barbaraport/esoja-api) e o [back-end da nova funcionalidade do app](https://github.com/barbaraport/softtelie-ehsoja/tree/main/src/server/imageRecognition) e inserir no arquivo ```\src\data\services\api.ts``` o IP e a porta do servidor.
13. Insira as chaves da API do Open Weather no arquivo ```\src\data\services\weather.services.ts```.
14. O jeito mais simples para executar o aplicativo é via USB. Sendo assim, conecte o seu celular no computador. O celular deve estar desbloqueado.
15. Certifique-se de que você está na pasta `\esoja-mobile\` e execute o nosso app com o comando ```npm run android``` . O app passará por um processo de *build* e a primeira vez pode demorar um pouco. Quando tudo estiver finalizado, o *app* automaticamente abrirá no seu celular!
