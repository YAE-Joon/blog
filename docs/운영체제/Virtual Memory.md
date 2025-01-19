***
## 1. Demand Paging
- 실제로 필요할 때 page를 메모리에 올리는 것(요청이 왔을 때 메모리에 올려놓는 것)
	- I/O양이 상당히 감소
	- Memory 사용량 감소
	- 빠른 응답 시간 (System wide하게 생각하면, 한정된 메모리 공간을 더 효율적으로 사용하기 때문에,) 
	- 더 많은 사용자 수용(multiprogram 환경)
	- 각각의 페이지마다 valid/invalid가 있음. 당장 필요한 부분은 메모리에 올라가고, 필요하지 않은 부분은 backing store에 있을 것이다.
		- Invalid의 의미 : 사용되지 않는 주소영역 또는 페이지가 물리적 메모리에 없는 경우
		- invalid 페이지의 경우 address translation 시에 page fault가 된다. 이때 운영체제로 CPU가 넘어가게 된다.(일종의 interrupt)
- Page Fault
	- invalid page를 접근하면 MMU가 trap을 발생시킨다.(page fault trap)
	- kernel mode로 들어가서, page fault handler가 invoke된다.
	- 다음과 같은 순서로 page fault를 처리한다.
		1. Invalid reference?(eg. bad address, protection violation) => abort process
		2. Get an empty page frame(없으면 뺏어온다 : replace)
		3. 해당 페이지를 disk에서 memory로 읽어온다.
			1. disk I/O가 끝나기 까지 이 프로세스는 CPU preempt 당함(block)
			2. Disk read가 끝나면 page tables entry 기록, valid/invalid bit = "valid"
			3. ready queue에 process를 insert -> dispatch later
		4. 이 프로세스가 CPU를 잡고 다시 running
		5. 아까 중단되었던 instruction을 재개
	- 대부분의 경우 page fault가 나지 않는다. 거의 98% 정도됨. 모두 메모리에 올라와있다. 하지만 한번 page fault가 나게 되면, overhead가 크기 때문에 시간이 오래걸린다.
- Free frame이 없는 경우
	- Page replacement
		- 어떤 frame을 쫓아낼 것인가? 알고리즘이 필요하다. 잘못 쫓아내면, overhead가 큰 작업을 다시 수행하기 때문이다. 
		- 곧바로 사용되지 않을 page를 쫓아내는 것이 좋음
		- 동일한 페이지가 여러 . 번메모리에서 쫓겨났다가 다시 들어올 수 있다.
	- Replacement Algorithm
		- page-fault rate을 최소화하는 것이 목표
		- 알고리즘 평가
			- Optimal Algorithm 
				- page fault를 가장 적게하는 알고리즘
				- MIN(OPT) : 가장 먼 미래에 참조되는 page를 쫓아낸다.
				- offline algorithm : 미래를 다 안다고 가정. 실제 시스템에서 사용은 불가능. 
				- 다른 알고리즘의 성능에 대한 upper bound 제공한다. : 즉, 가장 효율적인 알고리즘으로 다른 알고리즘과 비교하기위해 사용한다.
			- FIFO(First In First Out) : 먼저 들어온 것을 먼저 내쫓음
				- 메모리를 늘려주면, 오히려 성능이 나빠지는 경우가 있다. 
			- LRU(Least Recently Used) Algorithm
				- 가장 오래전에 참조된 것을 지움(실제 가장 많이 사용)
			- LFU(Least Frequently Used) : 참조 횟수(reference count)가 가장 적은 페이지를 지움
				- 최저 참조 횟수인 page가 여럿일 경우, 임의로 선정 또는 가장 오래전에 참조된 page를 지우게 구현 가능
				- page의 인기도를 좀 더 정확히 반영할 . 수있다.
				- 참조 시점의 최근성을 반영하지 못함
				- LRU보다 구현이 복잡하다.
				- ![Virtual Memory-20250117212438245.webp](images%2FVirtual%20Memory-20250117212438245.webp)
				- Cache 기법
					- 한정된 빠른 공간(Cache)에 요청된 데이터를 저장해 두었다가 후속 요청시 캐쉬로부터 직접 서비스하는 방식 
					- paging system외에도 cache memory, buffer caching, Web caching 등, 다양한 분야에서 사용
				- Cache 운영의 시간 제약
					- 교체 알고리즘에서 삭제할 항목을 결정하는 일에 지나치게 많은 시간이 걸리는 경우 실제 시스템에서 사용할 수 없음 (n개를 모두 살펴보는 시간은 너무 오래걸린다.)
					- Buffer caching이나 Web caching의 경우
						- O(1)~O(log n)정도까지 허용
					- Paging system인 경우 LRU, LFU를 사용하지 못한다!
						- page fault인 경우에만 OS 가 관여함
						- 페이지가 이미 메모리에 존재하는 경우 참조시각 등의 정보를 OS가 알 수 없음 (CPU를 OS가 가지고 있지 않기 때문에. CPU 제어권은 프로세스에 있다.)
						- O(1)인 LRU의 list조작조차 불가능
			- Clock Algorithm : 메모리 안에 page가 존재하고, page 마다 1bit가 존재한다.  0인 경우 최근에 페이지가 사용안된 경우이고, 1은 사용된 경우이다. 가장 오래된 페이지는 아니지만, 최근에 사용한 페이지는 아니기때문에 근사하게 LRU를 근사하게 한다.
			- 하드웨어가 주소변환 할때 1로 바꾸는 것이다. 
			- OS가 메모리를 쫓아내야하는 경우가 오면, 1로 되어있으면 0으로 바꾸고, 0은 쫓아내게 된다.(circular linked list)![Virtual Memory-20250117212444080.webp](images%2FVirtual%20Memory-20250117212444080.webp)
			- 1의 의미는 한바퀴 도는 동안 적어도 1번은 사용이 되었다는 뜻이다.
			- 여러 명칭이 있다. 
				- second chance algorithm
				- NUR(Not Used Recently) 또는 NRU(Not Recently Used)
			- reference bit(access bit)과 modified bit(dirty bit)을 함께 사용
			- reference bit : 최근에 참조된 페이지
			- modified bit : 최근에 변경된 페이지(I/O 동반하는 페이지) / 이 경우에는 reference와 modified 모두 1로 변경. 왜 필요한가? 쫓아낼 때, 만약에 쓰기를 했다면 disk에 써준 뒤에 쫓아내야하기 때문이다.
***
## 2. Page Frame 의 Allocation
- 위의 사항은 프로세스에 대한 고려를 하지 않는다. 어떤 프로세스가 와도 동일한 알고리즘으로 쫓아낸다. 이렇게 하는 것이 아니라, process에 미리 page frame을 할당 하는 것이다.
- Allocation의 필요성
	- 메모리 참조 명령어 수행시 명령어, 데이터 등 여러 페이지 동시 참조
		- 명령어 수행을 위해 최소한 할당되어야 하는 frame의 수가 있음
	- Loop를 구성하는 page들은 한꺼번에 allocate 되는 것이 유리함
		- 최소한의 allocation이 없으면 매 loop마다 page fault
- Allocation Scheme
	- Equal allocation : 모든 프로세스에게 동일하게 할당
	- Proportional allocation : 프로세스 크기에 비례하여 할당
	- Priority allocation : 프로세스의 priority에 따라 다르게 할당
	- Global replacement : 할당을 하지 않고 LRU같은 알고리즘을 사용.
		- 좋은 점 : 메모리를 많이 사용하는 프로그램에게 메모리를 많이 할당하게 됨
		- 문제점 : 특정 프로그램이 메모리를 독식할 수 있다.
	- Local replacement
		- 각 process 에게 할당을 해주고, 그 frame내에서만 replacement
		- 알고리즘은 동일하게 사용 가능
***
## 3. Thrashing
- Thrashing Diagram![Virtual Memory-20250117212450182.webp](images%2FVirtual%20Memory-20250117212450182.webp)
- 프로그램이 1개이면, I/O작업할 동안은 CPU가 놀기 때문에, CPU이용률이 낮다. 
- 프로그램이 2개이상이면 이 CPU이용률이 좀 더 높아진다.
- 어느순간 CPU이용률이 뚝 떨어지는 순간이 온다.이를 Thrashing이라고 한다. 즉 프로그램이 너무 많이 올려져있어서, 최소한의 메모리를 할당했기 때문에 누구에게 CPU를 주어도 page fault만 계속 일어나는 상황
- 운영체제는 CPU 이용률이 낮아서 프로세스를 더 할당해 악화가 된다.
- Working-Set model
	- Locality of reference
		- 프로세스는 특정 시간 동안 일정 장소만을 집중적으로 참조한다.
		- 집중적으로 참조되는 해당 page들의 집합을 locality set이라고 한다.
	- Working-set model
		- Locality에 기반하여 프로세스가 일정 시간 동안 원할하게 수행되기 위해 한꺼번에 메모리에 올라와 있어야하는 page들의 집합을 Working Set이라고 정의
		- Working Set 모델에서는 process의 working set 전체가 메모리에 올라와 있어야 수행되고, 그렇지 않을 경우 모든 frame을 반납한 후  swap out(suspend)
	- Working Set Algorithm
		- Working set window를 통해 알아낸다.
		- ex)현 시점에서 과거 10개의 window를 본다.
		- working set window에 10개의 page reference table에서 5개,2개 등 여러개의 page수를 원한다. ->메모리에 해당 공간이 있으면 할당, 그렇지 않으면 모두 Swap out 해서 꺼내버린다.(5개가 필요한데, 3공간이 남았다고 하면 모두 뺏어버리고 )
- Page -Fault Frequency(PFF) Scheme
	- page fault rate의 상한값과 하한값을 둔다.
		- Page fault rate이 상한값을 넘으면 frame을 더 할당한다.(page fault rate이 많이 발생한다는 것은 메모리 할당량이 적다는 것을 의미하는 것이기 때문)
		- Page fault rate이 하한값 이하이면 할당 frame수를 줄인다.
		- 빈 frame이 없으면 일부 프로세스를 swap out
- Page size를 줄이게 되면 어떻게 될 것인가? -> page table이 그만큼 늘어나게 된다. 물리적인 메모리도 늘어나게 된다.(불필요하게 낭비되는 메모리가 줄어들기 때문에) page fault가 자주 일어나게 된다. 사이즈가 작기 때문에,