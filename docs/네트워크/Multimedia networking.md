***
## 1. Multimedia audio
- Sampling : 아날로그 멀티미디어 오디오를 디지털 값으로 바꿔 전송
- Audio signal을 주기적으로 값을 판단함(연속적으로 확인하기 어려움) 
- ![Multimedia networking-20250117202751225.webp](images%2FMultimedia%20networking-20250117202751225.webp)
- 각각의 값을 저장하여 기록 -> 이 Coding Rate이 빠를 수록 더 많은 비트, 더 촘촘한 Sampling을 했기 때문에 음질이 더 좋아진다.
***
## 2. Multimedia video
- 이미지의 연속. 픽셀로 색의 값을 저장. 이웃한 부분의 색은 비슷한 색일 것이기 때문에 이 중복된 정보는 줄여서 압축시킨다.
- Audio와 마찬가지로 Coding rate가 크면 클수록 화질이 좋아질 것이다. 
- Sender -> receiver 로 보낼 때 속도가 이 영상을 압축해서 보내는 속도보다 빨라야 한다.
- ex) 영화 한편을 볼 때 -> Frame 순서대로 클라이언트에게 전송 -> 네트워크 -> 클라이언트
- ![Multimedia networking-20250117202755699.webp](images%2FMultimedia%20networking-20250117202755699.webp)
- 네트워크 상황에 따라 프레임의 딜레이가 생긴다. 또한 이 딜레이가 일정하지 않다. -> Network jitter (네트워크 상태가 일정하지 않음) 
- 이 문제를 해결하기위해 버퍼링이 존재. TCP send buffer 와 TCP receive buffer 가 존재. 이 버퍼에서 꺼내서 로딩함.
- 인코딩 -> 전송시 UDP 를 사용할 것인가 TCP를 사용할 것인가? --> 보내는 속도가 일정속도 이상이어야한다. UDP의 장점이 있지만 UDP는 네트워크 상황을 고려하지 않는다. TCP는 네트워크 상황을 고려하지만 자체로 보내는 속도자체가 느리다. 이를 어떻게 해결하는가? --> 유튜브는 TCP를 사용한다.
***
## 3. DASH
- 유튜브에서 사용하는 방식이다.
- Dynamic, Adaptive Streaming over HTTP 
- Chunk가 존재하고, Chunks number 와 각각의 버젼의 화질에 대한 데이터들이 있다.
- 네트워크 상태에 문제가 생기면 이 화질을 줄인 버젼의 데이터를 보낸다. (버퍼링을 최소화)
- 유튜브 서비스는 이용자가 1억명이 넘는다. 이 이용자가 동시에 유튜브에 요청이 들어오면 어떻게 처리를 해야하는가? 
- Cotent Distribution Network 기법을 사용 - 컨텐츠의 복사본이 전세계에 퍼져있어서, 제일 가까운 곳에서 이 요청을 받고 보내게 된다. 그렇다면 같은 url로 요청을 보냈는데 어떻게 가까운 곳에서 가져오게 하는가?
- host의 ip를 DNS에서 알려준다. 이 DNS 쿼리는 UDP를 통해 보내질것이고 이 패킷에 요청 ip address를 확인 후에 가장 가까운 저장소의 IP를 보내게 된다.