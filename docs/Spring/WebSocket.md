***
### WebSocket 
- 서버 - 클라이언트간에 단방향 통신의 단점을 해결하기 위한 기술로, WS 프로토콜 기반 클라이언트 서버 사이에 지속적인 완전 양방향 연결 스트림을 만들어 주는 기술
- 실시간 통신이 필요한 채팅, 주식 차트 등에서 많이 사용
- WebSocket Connection
	1. Connection을 맺기 위해 Http요청을 서버로 보낸다. 이 때 Http 요청 header에 WebSocket protocol로 업그레이드 하기위한 업그레이드 헤더와 Connection을 포함한다. 
	2. 서버가 101 응답코드를 전달하면 프로토콜 전환을 서버가 승인했음을 의미
	3. 여기까지 handshake 라고 생각하면 됨
	4. 데이터 전송이 시작됨. TCP connection이 생성된것이기 때문에 안정성이 보장
	5. 클라이언트 서버는 데이터 전송 후 Connection 종료를 할 수 있다.
	6. Web Socket중 한쪽이 연결을 종료하면 다른 한 쪽은 응답으로 Closed할 수 있다.
	- ![WebSocket-20250117215048997.webp](images%2FWebSocket-20250117215048997.webp)
	7. 연결 종료 후 수신되는 데이터들은 모두 버려지게 된다.
***
### WebSocket 특징
- 지속적인 완전 양방향 연결 스트림 제공
- OSI 모델 7계층에 위치(HTTP와 동일)
- HTTP Port 80, 443 에서 동작하도록 설계
- HTTP 보다 낮은 오버헤드와 빠른 속도 제공한다. 
	- Web Socket의 경우 처음 Handshake하는 경우에만 HTTP 프로토콜이므로 많은 양의 데이터를 전달하지만 이 후에는 메세지만 전송하게 된다. 
- HTTP와 WebSocket의 차이점	
	![WebSocket-20250117215053870.webp](images%2FWebSocket-20250117215053870.webp)
	- HTTP는 비연결성, 클라이언트의 요청마다 새로운 연결 형성, HTTP Port 80, 443에서 동작하도록 설계하였다면 WebSocket은 양방향 통신으로 연결이 계속 유지되며 이 연결로 양방향 데이터 전송이 가능하다.
***
### WebSocket만으로 실시간 채팅 만들기 ![WebSocket-20250117215058256.webp](images%2FWebSocket-20250117215058256.webp)
- 구현 방식: Spring 에서 제공하는 websocket 라이브러리를 이용하여 구현할 수 있다. http 프로토콜로 connection이 이루어지면 웹소켓 연결을 위한 프로토콜인 ws 로 업그레이드 되고, connection을 유지한다.
- 유지된 connection을 가지고 json 방식으로 데이터를 전송할 수 있다. 전송하기위해서는 연결된 websession들에게 보낼 수 있는데, 이는 Handler를 통해 접근할 수 있다. 이 handler에 접근하기 위해서는 Config 클래스에서, Websocket Configurer 를 상속받아 해당 프로토콜 접속 주소와 관련된 handler를 주입할 수 있고, 이를 handler에서 필요한 method에 따라 override해서 각각의 상태에 따라 접근하여 데이터 전송을 할 수 있다. 하지만 연결이 하나이기 때문에, 세션별로 저장해 원하는 session에만 전송하기 위해서는 별도의 자료구조를 통한 접근이 필요하다. Set을 활용하여 처음에 접근하였다. 하지만 이렇게 되면 해당 채팅방마다 Set 함수를 구현해서 세션을 저장해야하고, 세션들을 지우는 알고리즘이 필요하다. 단점이 많기 때문에 STOMP 프로토콜을 사용할 것이다.
***
