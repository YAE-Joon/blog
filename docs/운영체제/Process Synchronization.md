***
## 1. 데이터의 접근
- ![Process Synchronization-20250117212423496.webp](images%2FProcess%20Synchronization-20250117212423496.webp)
- Race condition: 데이터를 여러 곳에서 읽어서 연산을 하는 경우 문제가 생기게 된다.![Process Synchronization-20250117212428807.webp](images%2FProcess%20Synchronization-20250117212428807.webp)
	- 보통 CPU가 여러 개일때 이런 문제가 생긴다.  CPU가 한개 일 경우도 생기는가? -> 생긴다. 
	- OS에서의 race condition
		- ex) process 가 시스템 콜로 운영체제 안에 데이터를 바꿈 -> CPU 할당 시간이 끝나게됨 -> process b 로 넘어가게 됨 -> b도 시스템 콜을 하게됨 -> 운영체제 코드가 b의 요청에 의해 실행->a가 건들였던 데이터를 b의 요청에 의해서 변경 -> cpu가 a 로 넘어옴 -> 데이터는 이미 읽음 -> 변경해서 저장 // 시스템 콜에 의해 A가 읽은 데이터값과 B에 의해 저장된 값이 다르게 됨.
		- 해결책 : 커널모드에서 수행 중일 경우 CPU를 빼앗지 않는다. 커널 모드에서 사용자 모드로 돌아갈 때 preempt
***
## 2. Process Synchronization 문제
- 공유 데이터(shared data) 의 동시 접근 (concurrent access)은 데이터의 불일치 문제(inconsistency)를 발생시킬 . 수있다.
- 일관성(consistency)유지를 위해서는 협력 프로세스(cooperating process)간의 실행 순서(orderly execution)를 정해주는 메커니즘 필요
- Race condition
	- 여러 프로세스들이 동시에 공유 데이터를 접근하는 상황
	- 데이터의 최종 연산 결과는 마지막에 그 데이터를 다룬 프로세스에 따라 달라짐
- Race condition을 막기 위해서는 concurrent process는 동기화(Synchronize)되어야 한다.
##### Critical-Section
- n개의 프로세스가 공유 데이터를 동시에 사용하기를 원하는 경우 
- 각 프로세스의 code segment에는 공유 데이터를 접근하는 코드인 [critical section]이 존재
- Problem
	- 하나의 프로세스가 critical section에 있을 때, 다른 모든 프로세스는 critical section에 들어갈 수 없어야 한다.
- 프로그램적 해결법
	- Mutual Exclusion (상호 배제) : 프로세스 Pi가 critical section 부분을 수행 중이면 다른 모든 프로세스들은 그들의 critical section에 들어가면 안된다.
	- Progress(진행) : 아무도 critical section에 있지 않은 상태에서 critical section에 들어가고자 하는 프로세스가 있으면 critical section에 들어가게 해주어야 한다.
	- Bounded Waiting(유한 대기) : 프로세스가 critical section에 들어가려고 요청한 후부터 그 요청이 허용될 때까지 다른 프로세스들이 critical section에 들어가는 횟수에 한계가 있어야 한다. (A,B,C가 요청했을 때 A, B 만 번갈아 계속 들어가는 경우)
***
## 3. Synchronization Hardware
- 하드웨어적으로 Test&modify를 atomic하게 수행할 수 있도록 지원하는 경우 앞의 문제를 간단히 해결
- 값을 읽어내는 것과 값을 setting하는 것을 쪼개지 않고 동시에 할 수 있으면, 문제가 없다.
- ##### Semaphores : 추상 자료형 , 어떻게 구현되는 지는 논의되지 않고, object 와 operation으로 구성되는지가 중요.
	- integer variable 
	- 2가지 atomic 연산에 의해서만 접근 가능 
	- P(S) : 자원을 획득하는 과정 -> Lock 획득
	- V(S) : 자원을 반납하는 과정 -> Lock 반납
	- 위 자료구조에서 S(자원 카운팅하는 변수) 에 따라 획득하던지, 안하던지가 된다.
	- 원자적으로 수행할 수 있게 정의는 Hardware적으로 설정한다. 하지만 busy-wait 문제에는 효율적이지 못한다.(while문을 계속 돌기 때문)
	- Block 과 Wake-up 을 정의 : sleep lock -> lock이 걸려있으면 sleep시켜버림. -> PCB를 연결하고 sleep 시킨다.(자료구조 내에서)
	- busy-wait vs block/wake-up  : block/wake-up 과정도 일종의 overhead이다. Critical section의 길이가 긴 경우 Block/Wake-up이 적당하지만, 짧은경우는 오버헤드가 더 커질  수있기 때문에, busy-wait이 좋을 수 있다. 