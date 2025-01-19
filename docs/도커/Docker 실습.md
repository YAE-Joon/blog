***
### Node.js  app 생성
- Visual Studio Code를 이용한다. 
- 새로운 폴더를 생성후 package.json을 생성 
	- 터미널에서 npm init 을 통해 생성한다.
- Server.js 파일을 생성한다
	```js
	const expresss = require('express');
	
	const PORT = 8080;
	
	//APP
	
	const app = expresss();
	
	app.get('/',(req,res)=>{
	
	res.send("Hello World")
	
	});
	
	app.listen(PORT);
	```
- Dockerfile를 생성한다.
	```Docker
	FROM node:10
	
	RUN npm install
	
	CMD "node","server.js"
	```
- Dockerfile 의 base image를 alpine으로 쓰지 않고 node이미지를 왜 사용하는가?
	- alpine으로 build시 npm not found error가 나온다. 그 이유는, alpine 이미지는 가장 최소한의 경량화된 파일들이 들어있기에 npm을 위한 파일이 들어있지 않아서 RUN부분에 npm install을 할 수가 없다. npm 명령어를 수행하기 위해서는 npm 파일이 들어있는 base image가 필요하다. 그 이미지 중 하나가 node 이미지 이다.
- npm install 이란?
	- npm은 Node.js로 만들어진 모듈을 웹에서 받아서 설치하고 관리해주는 프로그램이다.
	- npm install은 package.json에 적혀있는 종속성들을 웹에서 자동으로 다운받아서 설치해주는 명령어
	- 결론적으로 현재 Node JS app을 만들때 필요한 모듈들을 다운받아 설치하는 역할을 한다. 
- "node","server"는 무엇인가?
	- 노드 웹 서버를 작동시키려면 node + 엔트리 파일 이름을 입력해야 한다. 이 엔트리 파일이 server.js이다. 
***
### Image build
- 터미널에서 docker build ./ 로 빌드하면 오류가 발생한다 .
	- Package.json 파일이 없다고 나오게 된다.
	- dockerfile로 image를 만들 때 Node base image를 만들 때 임시 컨테이너를 만들게 된다. 이 때 파일 스냅샷을 임시 컨테이너 하드디스크에 넣어주고 npm install하게 된다.
	- 이 때 package.json이 컨테이너 안에 있는게 아니라 밖에 존재하게 있다. 베이스 이미지에는 이런 파일들이 존재하지 않기 때문이다. 
	- 결국 이 파일들은 컨테이너 안으로 이동시켜주어야 한다. 
	- COPY package.json ./  명령어를 통해 도커 컨테이너의 지정된 장소에 복사해주면 된다.
	- 전체 파일을 복사하고 싶을 때는 COPY ./ ./ 을 한다.
***
### 생성된 이미지로 app 실행
- 이미지 빌드가 되었으면 해당 아이디 또는 -t 를 통해 설정해준 이름으로 docker run을 해 실행해준다.
- docker build -t smile/nodejs ./ 으로 빌드
- docker run smile/nodejs 로 실행
- 하지만 로컬호스트로 들어가면 접근이 되지 않는다. 그 이유는 네트워크도 로컬 네트워크에 있던 것을 컨테이너 내부에 있는 네트워크에 연결을 시켜주어야 하기 때문이다. 
- 이를 위해 실행을 위한 명령어 : `docker run -p 49160 : 8080 <이미지이름>`
- -p ...:... 은 로컬 네트워크와 컨테이너 내부 네트워크를 연결해준다. ![Docker 실습-20250119163845909.webp](images%2FDocker%20%EC%8B%A4%EC%8A%B5-20250119163845909.webp)
- 브라우저 url -> 컨테이너의 포트는 8080으로 설정하였다. 웹 브라우저의 url로 8080을 준다고 해서, 컨테이너 안의 8080으로 갈 수는 없다. 이를 로컬호스트에 mapping을 해주어야 한다. 그 과정이 -p 49160 : 808 명령어 이다.
- -p 는 port 를 의미
***
### redis 로 compose 기능 확인
- Redis : Remote Dictionary Server 는 메모리 기반의 키-값 구조 데이터 관리 시스템이며, 모든 데이터를 메모리에 저장하고 빠르게 조회할 수 있는 비관계형 데이터베이스(NoSql)이다.
- Redis를 쓰는 이유 : 메모리에 저장을 하기 때문에 Mysql같은 데이터베이스에 데이터를 저장하는 것과 데이터를 불러올 때 훨씬 빠르게 처리할 . 수있으며, 비록 메모리에 저장하지만 영속적으로도 보관이 가능하다. 서버를 재부팅해도 데이터를 유지할 수 있는 장점이 있다.
- Node.js 에서 Redis 사용 방법 
	1. redis-server 작동
	2. redis 모듈 다운
	3. 레디스 모듈을 받은 후 레디스 클라이언트를 생성하기 위해 Redis 에서 제공하는 createClient()함수를 이용해서 redis.createClient로 레디스 클라이언트 생성
	4. redis server가 작동하는 곳과 Node.js앱이 작동하는 곳이 다른 곳이라면 host인자와 port인자를 명시해주어야 한다.
	5. Redis 서버가 작동하는 곳이 redis-server.com이면 "https://redis-server.com"을 넣어주면 된다. 도커를 사용하지 않는 환경이므로 redis 서버가 작동되고 있는 곳의 host옵션을 URL로 넣어주는 것이다. 
	6. 도커 compose를 사용할 때는 host옵션을 docker-compose.yml 파일에 명시한 컨테이너 이름으로 주면 된다.![Docker 실습-20250119163850977.webp](images%2FDocker%20%EC%8B%A4%EC%8A%B5-20250119163850977.webp)
	7. 2개의 컨테이너가 있다.  이 컨테이너를 감싼것이 SERVICES 라고 있다.
	8. version을 지정해주어야한다.(docker compose의 버전
	9. services: 명시해주어야 한다. 
	10. redis-server: 컨테이너의 이름을 사용
	11. image : 컨테이너에서 사용하는 이미지
	12. node-app : 2번째 컨테이너 이름을 사용
	13. build : docker파일이 어디있는지 경로를 지정, 현재 경로일 경우 .을 해준다.
	14. ports: 포트를 매핑해준다.
	15. ![Docker 실습-20250119163901666.webp](images%2FDocker%20%EC%8B%A4%EC%8A%B5-20250119163901666.webp)
	16. docker compose up --build 명령어를 사용하면 build와 동시에 compose를 할 수 있다.
		- docker compose up : 이미지가 없으면 build하고, 있다면 그대로 compose함 docker compose는 yml 이 있는 디렉토리에서 해주어야 한다.
	17. docker compose down : 도커 컴포즈를 통해 작동시킨 컨테이너 들을 한꺼번에 중단 시킨다. 
	18. 하나의 터미널로 해결하고 싶을 경우, docker compose -d up 을 한다. d 는 detach로 실행 후 앱을 백그라운드에서 실행 시키고, output를 표출하지 않는다.