# Esquemas de 3º de primaria
Feitos para ver con [markmap](https://markmap.js.org/)

## https://gudeteira.github.io/esquemas-primaria/


## Instalación 
>Para instalar as dependencias necesarias para convertir os ficheiros e os hooks de git
`yarn install` na raíz do repo

## Librerías
>Uso [husky](https://typicode.github.io/husky/#/)  para xestionar os hooks de git, para no pre-commit exportar os `mm.md` a html e compoñer un `index.html` para telos a man.
O hook espera que markmap-cli esté instalado globalmente 
`yarn global add markmap-cli`

>Para parsear o index.html e enlazar os esquemas uso [node-html-parser](https://github.com/taoqf/node-html-parser)

