***
- 소프트웨어 운영 플랫폼의 변화
	- 초기 : Bare Metal -> 소프트웨어가 설치되어있지 않은 깡통시스템 ->  Application을 실행시킴
		- 한 대의 서버를 하나의 용도로만 사용, 남는 서버 공간은 그대로 방치, 하나의 서버에 하나의 운영체제, 하나의 프로그램만을 운영 --> 안정적이나 비효율적
	- 시대적으로 하드웨어는 가격이 하락,성능은 높아짐. 운영 시스템은 대용량이 되어감
	- Hypervisor X-> s/w  기술로 가상 컴퓨터 (VM) 를 만들고, 필요한 application을 올려서 쓰는 방식을 사용함 
		- Hypervisor기반의 가상화 --> 논리적으로 공간을 분할하여 VM이라는 독립적인 가상 환경의 서버 이용 가능
		- Hypervisor :  호스트 시스템에서 다수의 게스트 OS를 구동할 수 있게 하는 소프트웨어, 그리고 하드웨어를 가상화하면서 하드웨어와 각각의 VM을 모니터링하는 중간 관리자
	- 여기에서 더 발전하여, application이 요구에 따라 scale up, scale in 을 할  수 있게 하였다.
	- VM은 이런 요구사항에 맞추는데 한계가 있었음. -> 확장이 힘들기 때문에
	- 새로운 컨테이너 플랫폼이 나오게 되었다. OS 위에 컨테이너 엔진을 올리고 application을 올리게 되었다.
	- 컨테이너로 운영되는 application은 실제 application보다 적은 용량으로 운영되기 때문에, 확장성이 좋고 배포가 쉽다.
	- 도커는 이런 컨테이너를 세팅하는 엔진이다.
	- 개발자가 만든 애플리케이션이 운영환경에서 똑같이 실행될 수 있다.
***
### Docker
- 컨테이너를 사용하여 응용프로그램을 더 쉽게 만들고 배포하고 실행할 수 있도록 설계된 도구
- 컨테이너 기반의 오픈소스 가상화 플랫폼 
- 도커를 쓰는 이유 : 프로그램을 다운 받는 과정을 굉장히 간단하게 만들기 위함.  컨테이너로 운영되는 app은 실제 app보다 적은 용량으로 운영, 확장성이 좋고 배포가 쉬움.
- AWS, Azure 등 어디에서나 실행 가능
***
### 컨테이너
- 코드와 모든 종속성을 패키지화하여 으용ㅇ 프로그램이 한 컴퓨팅 환경에서 다른 컴퓨팅 환경으로 빠르고 안정적으로 실행되도록하는 소프트웨어의 표준 단위
- 컨테이너 이미지 : 코드, 런타임, 시스템 도구, 시스템 라이브러리 및 설정과 같은 응용프로그램을 실행하는 . 데필요한 모든 것을 포함하는 가볍고 독립적이며 실행 가능한 소프트웨어 패키지
	- 런타임에 컨테이너가 되고, 도커 컨테이너의 경우 도커 엔진에서 실행될 때 이미지가 컨테이너가 된다.
	- 리눅스와 윈도우 기반 애플리케이션 모두에서 사용할 수 있는 컨테이너화된 소프트웨어는 인프라에 관계없이 항상 동일하게 실행
	- 컨테이너는 소프트웨어를 환경으로부터 격리시키고 개발과 스테이징의 차이에도 불구하고 균일하게 작동하도록 보장
	- 즉, 도커 컨테이너는 도커 컨테이너의 인스턴스라고 생각하면 된다.
***
### Dokcer 흐름
 1. 도커 CLI(도커 Client)에 커맨드를 입력한다. 
 2. 도커 서버(도커 Daemon)이 그 커맨드를 받아서 그것에 따라 이미지를 생성하든 컨테이너를 실행하든 모든 작업을 하게 된다. 
 - 터미널에서 docker run hello-world 라는 커맨드 입력
	1. 도커 클라이언트에 다가 커맨드를 입력하니 클라이언트에서 도커 서버로 요청을 보냄
	2. 서버에서 hello-world라는 이미지가 이미 로컬에 cache가 되어 있는지 확인
	3. 현재 없기 때문에 Unable to find image ~ 라는 문구가 2번째 줄에 표시
	4. Docker Hub라는 이미지가 저장되어 있는 곳에 가서 그 이미지를 가져오고 로컬에 Cache로 보관한다.
	5. 이 . 후이미지가 있기 때문에 이 이미지를 이용하여 컨테이너를 생성한다.
	6. 이미지로 생성 된 컨테이너는 이미지에서 받은 설정이나 조건에 따라 프로그램을 실행한다.
- 도커와 하이퍼바이저 기반 VM 구조![Docker-20250119163813395.webp](images%2FDocker-20250119163813395.webp)
- 기존 가상화 기술에서 나온 것이 도커이다.
- 공통점
	- 도커 컨테이너와 가상 머신은 기본 하드웨어에서 격리된 환경 내에 애플리케이션을 배치하는 방법
- 차이점
	- 격리된 환경을 얼마나 격리시키는가의 차이
	- VM과 비교했을 떄 컨테이너는 하이퍼바이저와 게스트 OS가 필요하지 않으므로 오버헤드가 더 적다.
	- 애플리케이션을 실행할 때는 컨테이너 방식에서는 호스트 OS위에 애플리케이션의 실행 패키지인 이미지를 배포하기만 하면 된다.
	- VM은 VM을 띄우고 자원을 할당한 다음, 게스트 OS를 부팅하여 어플리케이션을 실행해야 해서 훨씬 복잡하고 무겁게 실행해야 한다.
- 도커 컨테이너 에서 돌아가는 app은 컨테이너가 제공하는 격리 기능 내부에 샌드박스가 있지만, 여전히 같은 호스트의 다른 컨테이너와 동일한 커널을 공유한다. 결과적으로, 컨테이너 내부에서 실행되는 프로세스는 호스트 시스템 (모든 프로세스를 나열할 수 있는 충분한 권한이 있음)에서 볼 수 있다.
- 예를 들어, 도커와 함께 몽고DB 컨테이너를 시작하면, 호스트(도커가 아님)의 일반 쉘에 ps-e grep 몽고를 실행하면 프로세스가 표시된다. 또한, 컨테이너가 전체 OS를 내장할 필요가 없는 결과, 그것들은 매우 가볍고, 일반적으로 약 5-100MB이다.
- 가상머신과 함께 VM 내부에서 실행되는 모든 것은 호스트 운영체제 또는 하이퍼바이저와 독립되어 있다. 가상 머신 플랫폼은 특정 VM에 대한 가상화 프로세스를 관리하기 위해 프로세스를 시작하고, 호스트 시스템은 그것의 하드웨어 자원의 일부를 VM에 할당한다. 그러나 VM과 근본적으로 다른 것은 시작 시간에 이 VM 환경을 위해 새롭고 이 특정 VM만을 위한 커널을 부팅하고, 웅영체제 프로세스 세트를 시작한다는 것이다.(굉장히 큰 작업)이것은 응용프로그램만 포함하는 일반적인 컨테이너보다 VM의 크기를 훨씬 크게 만든다. OS까지 가상화(맥-> 윈도우, 리눅스-> 윈도우) 하는 방법은 굉장히 느리다.
***
### 컨테이너 격리
- 컨테이너와 호스트에서 실행되는 다른 프로세스 사이에 벽을 만드는 리눅스 커널 기능
	- C group(control group) 
		- CPU, 메모리 , Network Bandwith, HD i/o 등, 프로세스 그룹의 시스템 리소스 사용량을 관리 : 어떤 어플이 사용량이 너무 많다면, 그 어플리케이션 같은 것을 C group에 집어 넣어서 CPU와 메모리 사용 제한 가능
	- name Spaces
		- 하나의 시스템에서 프로세스를 격리시킬 수 있는 가상화 기술
		- 별개의 독립된 공간을 사용하는 것처럼 격리된 환경을 제공하는 경량 프로세스 가상화 기술
- 리눅스환경에서 사용가능한 이 커널기능을 어떻게 docker 컨테이너에서 사용이 가능한가?![Docker-20250119163816708.webp](images%2FDocker-20250119163816708.webp)
- 실제 내부 환경 : docker client 와 server는 리눅스환경에서 돌아간다고 생각하면 된다.
***
### 도커 이미지로 컨테이너 만들기
- 이미지는 응용프로그램을 실행하는데 필요한 모든 것을 포함한다.
	- 시작시 실행 될 명령어 (run ~) --> 이미지에서 이 명령어를 가지고 있어야 한다.
	- 파일 스냅샷 ( 디렉토리나 파일을 카피한 것)
- 순서
	1. Docker 클라이언트에서 `docker run <이미지>` 입력
	2. 도커 이미지에 있는 파일 스냅샷을 컨테이너 하드 디스크에 옮겨 준다.
	3. 이미지에서 가지고 있는 명령어(컨테이너가 실행될 때 사용될 명령어)를 이용해서 파일을 실행
		- 컨테이너가 실행될 때, 명령어가 실행되면서 커널을 통해 프로그램이 실행된다.
- 이미지 내부 피일 시스템 구조 
	- `docker run  <이미지> ls` : ls커맨드는 현재 디렉토리의 파일 리스트를 표출
		- ex) `docker run alpine ls `
		- hello-world 이미지로는 ls명령어 사용이 불가능 하다. excutable file  not found(실행할 수 있는 파일 못 찾음) : hello-world 는 몇가지 문장만 보여주는 이미지. ls를 실행할 파일들이 존재하지 않기 때문에 사용이 불가능
		- 
- 컨테이너 나열
	- `docker run <이미지> ping localhost` : ping을 계속 보내서 실행되고 있음을 보여줌
	- `docker run ps`  : 실행중인 docker의 리스트 나열 ps : process status
		- container ID : 컨테이너 고유한 아이디 해쉬값(실제로 길지만 일부만 표출)
		- IMAGE : 컨테이너 생성시 사용한 도커 이미지
		- COMMAND : 컨테이너 시작시 실행될 명령어. 대부분 이미지에 내장되어 있으므로 별도 설정이 필요없다.
		- CREATED : 컨테이너 생성된 시간
		- STATUS : 컨테이너의 상태, 실행중 :Up, 종료 : Exited, 일시정지 : Pause
		- PORTS : 컨테이너가 개방한 포트와 호스트에 연결한 포트. 특별한 설정을 하지 않은 경우 출력되지 않는다.
		- NAMES : 컨테이너 고유 이름. 컨테이너 생성시 --name 옵션으로 이름을 설정하지 않으면 도커 엔진이 임의로 형용사와 명사를 조합해 설정. id와 마찬가지로 중복이 안되고 docker rename명령어로 이름을 변경할 수 있다.
	- `docker ps --format 'table{{.Names}}\t\table{{.Image}}'` : 컨테이너에서 원하는 항목만 보여주기
	- `docker ps -a` : 모든 컨테이너 나열
***
### Docker 컨테이너 생명 주기와 명령어
![Docker-20250119163823672.webp](images%2FDocker-20250119163823672.webp)
- `docker run <이미지 이름>` -> 2개로 쪼개서 생성 실행할 수 있다.
	- `docker create <이미지 이름>` : 생성
	- `docker start <시작할 컨테이너 아이디/이름>` : 시작 ( 컨테이너가 이미 생성되어 있기 때문)
		- `-a` : attatch 로 아이디의 일부로 시작 가능, docker가 실행될 때 그 output을 화면에 표출해준다.
- `docker stop <중지할 컨테이너 아이디/이름>`
- `docker kill <중지할 컨테이너 아이디/이름>`
- `stop vs kill` : 둘다 컨테이너를 중지 시킨다. 
	- `stop` : Gracefully하게 중지. 그 동안 하던 작업들을 완료하고 컨테이너를 중지
		- `docker stop` -> `Sigterm` -> `sigkill` -> 중지
	- `kill` : stop과 달리 어떤 것도 기다리지 않고 바로 컨테이너를 중지
- `docker rm <중지할 컨테이너 아이디/이름>`
	- 실행중인 컨테이너는 먼저 중지한 후에 삭제가능
- `docker rm docker ps -a -q` : 모든 컨테이너 삭제
- `docker rmi <이미지 id>` : 이미지 삭제
- `docker system prune` : 한번에 컨테이너, 이미지, 네트워크 모두 삭제, 실행중인 컨테이너에는 영향을 주지 않는다.
- 실행중인 컨테이너에 명령어를 전달하고 싶은 경우
	- `docker exec <컨테이너 아이디>`
- redis 를 이용한 컨테이너
	- docker run redis : redis 서버를 작동
	- `docker exec -it<컨테이너 아이디> redis-cli` : redis client 실행
		- docker 안에서 redis server를 돌리고 있으므로, 컨테이너 안에서 redis client도 실행을 시켜야한다. 외부에서는 접근이 불가능하다.
		- -it : 명령어를 실행한 후 계속해서 명령어를 적을 수 있다. interactive terminal, it가 없다면 실행 후 바로 나가진다.
- 명령어를 계속해서 넣기 위해서는 -it를 붙이는 명령어를 사용했다.하지만 그 외 컨테이너 안에 쉘이나 터미널 환경으로 접속이 가능하다.
	- `docker exec -it <컨테이너 아이디>` 명령어(sh, bash, zsh, powershell): 이미지에 따라 될 수도 있고 안될 수도 있다.
	- 환경을 터미널로 변경해준다.
	- 쉘환경에서 빠져나오려고 할 때는 control + d
***
### Docker image 만들기
- 도커 이미지는 Dockerhub에 이미 다른 사람들이 만들어 놓은 것을 이용할 수 있으며, 직접 도커 이미지를 만들어서 사용할 수 도 있고 직접  만든 것을 dockerhub에 업로드할 수도 있다.
- 도커 이미지 생성 순서
	- Docker file 작성 -> 도커 클라이언트 -> 도커 서버 -> 이미지 생성
	- Docker file : Docker Image를 만들기 위한 설정 파일, 컨테이너가 어떻게 행동해야 하는지에 대한 설정들을 정의해준다.
	- 도커 클라이언트 : 도커 파일에 입력된 것들이 도커 클라이언트에 전달
	- 도커 서버 : 도커 클라이언트에 전달된 모든 중요한 작업들을 하는 곳
- Docker file
	- 도커 이미지를 만들기 위한 설정 파일이며, 컨테이너가 어떻게 행동해야 하는지에 대한 설정들을 정의해 주는 곳
	- Docker file 만드는 순서(도커 이미지가 필요한 것이 무엇인지 생각)
		1. 베이스 이미지를 명시 ( 파일 스냅샷에 해당)
		2. 추가적으로 필요한 파일을 다운 받기 위한 몇가지 명령어를 명시(파일 스냅샷에 해당)
		3. 컨테이너 시작시 실행 될 명령어를 명시(시작시 실행 될 명령어에 해당)
- 베이스 이미지 : 도커 이미지는 여러개의 레이어로 되어 있다. 그 중, 베이스 이미지는 이 이미지의 기반이 되는 부분이다.OS라고 생각하면 된다.

	```Docker
	#베이스 이미지 명시  
	From baseImage  
	  
	#추가적으로 필요한 파일들을 다운로드 받는다.  
	Run command  
	  
	#컨테이너 시작시 실행 될 명령어를 명시해준다.  
	CMD ["executable"]
	```
	- `From` : 이미지 생성시 기반이 되는 이미지 레이어. `<이미지 이름>:<태그>`형식으로 작성. 태그를 안붙이면 자동적으로 가장 최신것으로 다운받는다. ex) ubuntu:14.04
	- `RUN` : 도커이미지가 생성되기 전에 수행할 쉘 명령어
	- `CMD.` : 컨테이너가 시작되었을 때 실행할 실행 파일 또는 쉘 스크립트. 해당 명령어는 Docker file내 1회만 쓸 수 있다.       
- 도커 파일에 입력된 것들이 도커 클라이언트에 전달되어서 도커 서버가 인식하게 하여야 한다. 그렇게 하기 위해서는 docker build ./ 또는 docker build . 를 한다.
- Build 명령어 : 해당 디렉토리 내에서 dockerfile이라는 파일을 찾아서 도커 클라이언트에 전달, docker build 뒤에 ./ 와 . 은 둘 다 현재 디렉토리를 가리킨다.
	1. Alpine 이미지 를 가져온다. (시작시 실행 될 명령어 + 파일 스냅샷)
	2. 임시 컨테이너 생성 (하드 디스크에 파일 시스템 스냅샷 추가, 시작시 실행될 명령어 추가)
	3. 임시 컨테이너로 이미지를 생성 : 이미지를 만들 때, 베이스이미지를 임시컨테이너에 넣어주고, 그 외 레이어도 함께 넣어준다. 이 후 커맨드를 넣어준다.
	4. 임시 컨테이너를 토대로 새로운 컨테이너를 생성
	5. 임시 컨테이너를 제거
- 도커 이미지에 이름 설정
	- `-t [내 도커 아이디] / [저장소,프로젝트 이름 ] : [버젼] `
	- `-t` 는 tag 를 의미
***
### Working Directory 
- 이미지 안에서 app 소스코드를 갖고있을 디렉토리를 생성하는 것. 이 디렉토리가 app의 working directory가 된다.
- working directory를 따로 있어야 하는 이유 : Node 이미지에 파일 스냅샷
- Node의 이미지 Root 디렉토리에는 home, bin, dev등 여러 파일들이 있다. 여기에 COPY한 모든 소드코드 파일들을 root 디렉토리에 저장하게 된다.
- 문제점 
	1. COPY 파일의 이름이 원래 파일 시스템의 이름과 같다면, 원래 파일을 지우고 덮여쓰여져버리게 된다.
	2. 사용해야할 소스코드와 root directory 파일과 섞여져버려 정리가 되어있지 않다.
- 이런 이유로 Dockerfile 만들 때 WORKDIR를 설정해주어야 한다.
***
### Docker image src 변경
- 소스코드가 변경되었다고 해서 build를 통해 다시 이미지를 생성하여 run을 해주는 것을 매우 비효율적이다.![Docker-20250119163830266.webp](images%2FDocker-20250119163830266.webp)
- 중간에 Package.json ./을 넣게 되면 cache에 종속성이 저장되어지기 때문에, 빠르게 종속성을 다운받을 필요가 없다. 소스가 변경된 부분은 종속성을 변경하는 부분이 아니기 때문에 이런 부분을 변화시켜주기 위해서 종속성 부분만 따로 copy를 해준 다음에, 이를 install하고,  src 파일들이 copy된다. src파일들은 npm install에 영향을 받지 않기 때문에, 해당 방식으로 하게 되면 종속성을 다시 다운받지 않고 cache를 사용하게 된다.
### Docker volume
- Docker 컨테이너에서 Copy해서 파일을 가져오는 것이 아니라 , 로컬에 있는 파일을 참조(Mapping)하는 것을 말한다.
- 명령어 : ![Docker-20250119163837644.webp](images%2FDocker-20250119163837644.webp)
- node_module은 참조하지 않아도 되는 부분(컨테이너에서 맵핑을 하지 않아야 한다. host directory에 없기 때문에)
- -v $pwd (print working directory) : 현재 작업중인 디렉토리의 이름을 출력하는데 쓰인다.
	- 이 경로에 있는 것을 mapping시켜주는 것이다. (현재 로컬의 디렉토리와 : 컨테이너 디렉토리의 매핑)
- 이미지를 다시 빌드하지 않아도 바꾼 코드가 적용
***
### Docker Compose
- 다중 컨테이너 도커 애플리케이션을 정의하고 실행하기 위한 도구
- Docker 컨테이너를 여러개로 구성하는 경우 컨테이너 끼리는 아무런 설정없이 접근을 할 수 없다. 따라서 만약 Node.js 와 redis 서버가 각각 컨테이너로 있다고 한다면, 노드 js 앱에서 레디스 서버로 접근을 할 수 없게 된다.
- 멀티 컨테이너 상황에서 쉽게 네트워크를 연결시켜주기 위해서 Docker Compose를 이용한다.
- Docker compose 파일은 yml 파일로 사용한다.
- yml : YAML ain't markup language의 약자이다. 일반적으로 구성 파일 및 데이터가 저장되거나 전송되는 응용 프로그램에서 사용되고 원래는 XML이나 json포맷으로 많이 쓰였지만, 좀 더 사람이 읽기 쉬운 포맷으로 나타내었다.
