***
## 1. CPU scheduling의 필요성 
- 대다수의 process 는 CPU를 오래 쓰기 보다는 I/O 를 기다리는 시간이 더 길다. 이를 I/O bound job이라고 한다. 보통 사람과 interaction 이 많은 경우를 말한다. CPU bound job 은 CPU를 오래 쓰는 일을 말한다. (주로 계산 위주의 job)
	- CPU burst : Process에서 CPU를 한번에 사용하는 시간
- 여러 종류의 job(process)가 섞여있기 때문에, 누구에게 얼마만큼의 시간동안 배분해야 할 것인가가 필요하다. 즉 CPU와 I/O 장치 등 시스템 자원을 골고루 효율적으로 사용해야 하기 위한 CPU scheduling이 필요하다.![CPU scheduling-20250117212313100.webp](images%2FCPU%20scheduling-20250117212313100.webp)
***
## 2. CPU Scheduler&Dispatcher
- CPU Scheduler 
	- Ready 상태의 프로세스 중에서 CPU를 줄 프로세스를 고른다.
- Dispatcher
	- CPU의 제어권을 CPU scheduler 에 의해 선택된 프로세스에게 넘긴다.
	-  이 과정을 context Switch 라고 한다.
- CPU Scheduling이 필요한 경우 프로세스의 상태 변화
	1. Running -> Blocked (예. I/O 요청 시스템 콜)
	2. Running -> Ready(예. 할당 시간 만료로 timer interrupt)
	3. Blocked -> Ready(예. I/O완료 후 인터럽트)
	4. Terminate
	- 1,4 는 nonpreemptive( 강제로 빼앗지 않음)
	- 2,3 은 preemptive(강제로 빼앗음)
- Scheduling Criteria 
	- CPU utilization (이용률) : 높을 수록 좋음. CPU를 계속 사용했다는 뜻을 효율이 높다는 뜻
	- Throughput(처리량) : 많을수록 좋음
	- Turnaround time (소요시간) : 짧을 수록 좋음
	- Waiting time (대기시간) : CPU를 쓰러온다음 기다린 총 시간(Ready queue에서 기다림)
	- Response time (응답시간) : CPU를 쓰러 들어온다음, 최초로 CPU를 얻기까지 걸린 시간(CPU burst 들어와서 최초로 CPU를 얻기 까지)
***
## 3. CPU Scheduling Algorithms
- FCFS(First-Come First-Serve)
	- nonpreemptive(강제로 빼앗지않음)
	- 도착한대로 CPU를 쓰게함.
	![CPU scheduling-20250117212318954.webp](images%2FCPU%20scheduling-20250117212318954.webp)
	- 만약 P2,p3가 먼저 도착한 경우![CPU scheduling-20250117212325651.webp](images%2FCPU%20scheduling-20250117212325651.webp)
	- waiting time이 굉장히 차이가 많이 나게 된다. 
	- Convoy effect : 이렇게 긴 시간이 걸리는 process가 먼저 도착하여 waiting time이 길어지는 효과
	
- SJF(Shortest-Job-First)
	- 각 프로세스의 다음번 CPU burst time을 가지고 스케쥴링에 활용
	- CPU burst time이 가장 짧은 프로세스를 제일 먼저 스케쥴
	- 2가지 버전이 있다.
		- Nonpreemptive : 빼앗기지 않음. 즉 일단 CPU를 잡으면 이번 CPU burst가 완료될 때까지 CPU를 선점 당하지 않음,(CPU를 준 순간, 더 짧은 process가 온다고 해도 뺏기지 않음)
		- Preemptive : 현재 수행중인 프로세스의 남은 burst time보다 더 짧은 CPU burst time을 가지는 새로운 프로세스가 도착하면 CPU를 빼앗김
		- SRTF(Shortest Remaining Time First)이라고 부른다.
	- optimal : 주어진 프로세스들에 대해 minimum average waiting time을 보장
	- 치명적인 약점이 있다.
		- Starvation 을 발생 : Long job은 영원히 CPU를 못 얻을 수 있다.
		- CPU를 얼만큼 쓸지를 큐에 들어온 시점에 알수 없다. : 예측할 수는 있음. 과거의 CPU burst를 이용해서 추정 (exponential averaging)
- Priority Scheduling
	- Priority number 를 통해 process에게 부여
	- highest priority를 가진 프로세스에게 CPU할당
		- preemptive 
		- nonpreemptive 
	- SJF는 일종의 priority scheduling 이다.
	- 문제점 : Starvation
	- 해결책 : Aging (시간에 따라 priority를 높인다.)
- Round Robin(RR)
	-  timer에 따라 interrupt를 걸어서 넘긴다. 각 프로세스는 동일한 크기의 할당 시간을 가짐(10~100ms)
	- 할당 시간이 지나면 프로세스는 선점(preempted)당하고 ready queue 의 제일 뒤에 가서 다시 줄을 선다.
	- n개의 프로세스가 ready queue에 있고 할당시간이 q time unit인 경우 각 프로세스는 최대 q time unit단위로 CPU시간의 1unit이다.
	- RR의 장점 : average turnaround time 은 길지만, response time은 더 짧다.(최초로 CPU를 받기까지 걸린 시간) - homogenous job일 경우는 별로 좋지 않다.( 긴 시간의 job, 짧은 시간의 job 모두 다르기 때문)
	- 현재 많이 사용하는 방식
- Multilevel Queue 
	- Ready Queue를 여러 개로 분할
		- foreground(interactive)
		- background(batch - no human interaction)
	- 각 큐는 독립적인 스케쥴링 알고리즘을 가짐
		- foreground-RR
		- background-FCFS
	- 큐에 대한 스케쥴링이 필요
		- Fixed priority scheduling
		- Time slice
- Multilevel Feedback Queue 
	- Multilevel Queue와 같지만 큐간 이동이 가능하다.
	- 각각의 큐마다 알고리즘을 둘 수 있다.
	- 상위 큐로 상승시키는 기준과 하위 큐로 강등시키는 기준이 있음
	- aging과 같은 방식으로 구현이 가능하다. starvation을 해결할 수 있다. 
- Multiple-Processor Scheduling 
	- CPU가 여러 개인 경우 스케쥴링은 더욱 복잡해진다.
		- Homogeneous processor인 경우 : Queue에 한줄로 세워서 각 프로세서가 알아서 꺼내가게 할 수 있다.
		- 반드시 특정 프로세서에서 수행되어야 하는 프로세스가 있는 경우(제약조건) 문제가 복잡(하나의 CPU에서 process 여러 개가 작업해야한다.)
		- Load sharing
			- 일부 프로세서에 job이 몰리지 않도록 부하를 적절히 공유하는 메커니즘 필요
			- 별개의 큐를 두는 방법 vs 공동 큐를 사용하는 방법
		- Symmetric Multiprocessing(SMP)
			- 각 프로세서가 각자 알아서 스케쥴링 결정
		- Asymmetric multiprocessing
			- 하나의 프로세서가 시스템 데이터의 접근과 공유를 책임지고 나머지 프로세서는 거기에 따름
***
## 4. Thread Scheduling 
- Local Scheduling
	- User Level thread 의 경우 사용자 수준의 thread library에 의해 어떤 thread를 스케쥴할지 결정
- Global Scheduling
	- Kernel level thread의 경우 일반 프로세스와 마찬 가지로 커널의 단기 스케줄러가 어떤 thread를 스케줄할 지결정
***
