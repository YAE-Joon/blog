***
## 1. 프로세스(Process)와 스레드(Thread)의 차이

### 프로세스(Process)
- 운영체제에서 할당 받는 자원 단위(실행 중인 프로그램)
- CPU동작 시간, 주소공간(독립적)
- Code, Data, Stack, Heap -> 독립적
- 최소 1개의 메인 스레드를 보유
- 파이프, 파일, 소켓 등을 사용해서 프로세스간 통신(Cost 높음) -> Context Switching

### 스레드(Thread)
- 프로세스 내에 실행 흐름 단위
- 프로세스 자원 사용
- stack만 별도 할당 나머지는 공유(Code, Data, Heap)
- 메모리 공유(변수 공유)
- 한 스레드의 결과가 다른 스레드의 영향을 끼침
- 동기화 문제는 정말 주의(디버깅이 어려움)

***
## 2. 멀티스레딩(Multi-threading)
- 한 개의 단일 어플리케이션(응용프로그램)
- 시스템 자원 소모 감소(효율성), 처리량 증가(Cost 감소)
- 장점: 통신 부담 감소
- 단점: 디버깅 어려움, 동기화 문제(교착상태), 자원 공유 문제, 잘못 구현 시 프로그램 성능 저하

***
## 3. 멀티프로세싱(Multi-processing)
- 한 개의 단일 어플리케이션(응용프로그램) -> 여러 프로세스로 구성 후 작업 처리
- 장점: 한 개의 프로세스 문제 발생은 확산 없음 (프로세스 Kill)
- 단점: 캐시 체인지, Cost 비용 매우 높음(오버헤드), 복잡한 통신 방식을 사용

***
## 4. GIL(Global Interpreter Lock)
- 실행 원리 : CPython -> Python(bytecode) 실행 시 여러 Thread 사용할 경우 단일 스레드만이 Python object에 접근하게 제한하는 Mutex
- Cpython 메모리 관리가 취약 때문(즉, Thread-safe)
- 단일 스레드로 충분히 빠르다.
- 프로세스 사용 가능(Numpy/Scipy)등 Gil 외부 영역에서 효율적인 코딩
- 병렬 처리는 Multiprocessing, asyncio 선택지 다양
- thread 동시성 완벽 처리를 위해 -> Jython, IronPython, Stackless Python 등이 존재
- 고성능 파이썬(책)
