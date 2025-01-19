***
## 1. File
- A named collection of related information
- 일반적으로 비 휘발성의 보조기억장치에 저장
- 웅여체제는 다양한 저장 장치를 file이라는 동일한 논리적 단위로 볼 수 있게 해준다.(하드디스크1, 2 있으면, 운영체제는 서로 다른 파일로 구분)
- Operation
	- create, read, write, delete, open, close, lseek(reposition)-> 파일을 읽으면 포인터가 존재. 이 포인터는 자동으로 읽게되면 다음 포인터로 간다. 파일을 그 부분부터 읽기 위해 포인터를 수정해주는 작업
- File attribute(혹은 파일의 metadata)
	- 파일 자체의 내용이 아니라 파일을 관리하기 위한 각종 정보들
		- 파일 이름,유형,저장도니 위치, 파일 사이즈 등
		- 접근 권한(읽기/쓰기/실행), 시간(생성/변경/사용), 소유자 등
- File system 
	- 운영체제에서 파일을 관리하는 부분
	- 파일 및 파일의 메타데이터, 디텍토리 정보 등을 관리
	- 파일의 저장 방법 결정
	- 파일 보호 등
- Directory
	- 파일의 메타데이터 중 일부를 보관하고 있는 일종의 특별한 파일
	- 그 디텍토리에 속한 파일 이름 및 파일 attribute들
	- operation
		- search for a file, create a file, delete a file
		- list a directory, rename a file, traverse the file system
- Partition (=Logical Disk)
	- 하나의 (물리적)디스크 안에 여러 파티션을 두는게 일반적
	- 여러 개의 물리적인 디스크를 하나의 파티션으로 구성하기도 한다.
	- (물리적)디스크를 파티션으로 구성한 뒤 각각의 파티션에 file system을 깔거나 swapping등 다른 용도로 사용할 수 있다.
- Open()
	- 파일에 시스템에는 metadata 도 있을 것이다. 파일을 오픈하면, 메타데이터가 메모리로 올라오게 되는 것이다.
	- ex) open("a/b/c") : 디스크로부터 파일 c의 메타데이터를 메모리로 가지고 온다.
	- root 의 metadata를 먼저 메모리에 올린다. -> root의 content가 어디에 있는지 찾을 수 있다. directory 파일이므로, 그 directory 파일의 메타데이터를 가지고 있다. 그 중, a라는 파일에 메타데이터 가 있을 것이다. 이를 메모리에 올린다. 이를 통해 a 의 content위치를 알게 될것이고, 이를 통해 b의metadata를 가져오게 된다. 시스템 콜을 한 프로세스는 b를 가리키는 pointer가 file descripter로 PCB에 저장 된다. 이 위치를 가지고 file 은 read할 수 있다.![File System-20250117212337495.webp](images%2FFile%20System-20250117212337495.webp)
	- I/O작업이므로 OS가 메모리에 먼저 읽고 이 copy를 process에 준다. -> 만약 동일한 위치에 시스템 콜하면, 저장할 수 있다. 이를 buffer cashing이라고 한다. 모든 정보를 운영체제가 알기 때문에 LRU 같은 알고리즘을 사용할 수 있다.
	- Process A의 PCB에 저장하고 있는 Descriptor는 per-process file descriptor table 이라고 하고, 
	- Open file table은 system-wide open file table이라고 한다. 두 종류 외에도 시스템에 따라 여러개가 된다. 
	- meta data 가 메모리에 올라오면 프로세스마다 필요한 metadata가 있고 이 정보를 offset으로 저장한다. 
***
## 2. File Protection
- 각 파일에 대해 누구에게 어떤 유형의 접근(read/write/execution)을 허락할 것인가?
- Access Control 방법
	- 접근권한이 누구에게 있는가?
	- 접근연산이 어떤것이 가능한가? 
	- 2가지가 필요하다. 여러 방법이 존재한다.
	- Access control Matrix 
		- 행렬로 file마다 user를 나열하고, 특정 파일이 특정 user에게 권한이 있는가를 정해준다.
		- Access control list : 파일별로 누구에게 어떤 접근 권한이 있는지를 표시하는 방법
		- Capability : 사용자를 기준으로 자신이 접근 권한을 가진 파일 및 해당 권한 표시
		- 일반적으로 overhead가 너무 커서 사용하기 힘들다.
	- Grouping
		- 전체 user를 owner, group, public의 세 그룹으로 구분
		- 각 파일에 대해 . 세그룹의 접근 권한(rwx)을 3비트씩으로 표시![File System-20250117212344977.webp](images%2FFile%20System-20250117212344977.webp) 9bit만 필요
	- Password
		- 파일마다 password를 두는 방법(디텍토리 파일에 두는 방법도 가능)
		- 모든 접근 권한에 대해 하나의 password: all-or-nothing
		- 접근 권한별 password : 관리문제
***
## 3. File System의 Mounting
- file system의 하나가 다른 partition 에 있는 file system에 접근해야 하는 경우 Mounting 연산
- 한 쪽 파일시스템의 root 가 Mount를 해서 서로 연결을 해서 접근한다.
***
## 4. Access Methods
- 시스템이 제공하는 파일 정보의 접근 방식
	- 순차 접근 (sequential access) : 카세트 테이프를 사용하는 방식처럼 접근 A-> C 로 바로 갈 수 없음.
		- A->B->C 로 가야함
	- 직접 접근 (direct access, random access)
		- LP 레코드 판과 같이 접근하도록 한다.
		- 파일을 구성하는 레코드를 임의의 순서로 접근할 수 있다.
		- 파일을 어떻게 관리하느냐에 따라 순차접근해야하는 경우가 있다.
***
## 5. Allocation of File Data in Disk
- Disk에 파일을 저장할 때는 Disk마다 sector를 가지고 저장한다.
- Contiguous Allocation(연속 할당)
	- 하나의 파일이 Disk에 연속해서 할당하는 방식
	- 단점 : external fragmentation 이 생길 수 있다.
		- file grow 가 어려움
			- file 생성시 얼마나 큰 hole을 배당할 것인가?
			- grow 가능 vs 낭비 (internal fragmentation)
	- 장점 : 빠른 I/O가 가능(시작 위치만 seek를 하면 많은 바이트 transfer)
		- Realtime file 용(deadline이 존재)으로, 또는 이미 run 중이던 process의 swapping 용(swapping은 의미 없는 공간. 속도 효율성이 중요한 공간이다. 금방 지워질 데이터이기 때문)
		- Direct access가 가능 : directory의 중간 위치를 미리 알 수 있다.
	
- Linked Allocation
	- 파일의 데이터를 빈 공간에 위치를 시킨다.
	- 장점 : External fragmentation 발생하지 않는다
	- 단점 :
		- 디스크의 각각의 head가 이동을 해야한다. 
		- Reliability 문제
			- 한 sector가 고장나 pointer가 유실되면 많은 부분을 잃음
			- pointer를 위한 공간이 block의 일부가 되어 공간 효율성을 떨어뜨림
				- 512byte 단위로 보통 저장하는데, pointer 저장이 4byte를 차지한다.
	- 변형 
		- File-allocation table(FAT) 파일 시스템
			- 포인터를 별도의 위치에 보관하여 reliability 와 공간 효율성 문제 해결
	
- Indexed Allocation
	- block 중 index block을 두고, 여기에 할당된 파일의 정보를 알 수 있다.
	- 장점 : External fragmentation 이 발생하지 않음
		- 직접접근이 가능하다.
	- 단점 : small file의 경우 공간 낭비(실제로 많은 file이 small)
		- 굉장히 큰 파일의 경우에 block 으로 index 표현이 불가능 하다.
			- multilevel index(2단계 page table 생각)를 사용
			- linked scheme
***
## 6. UNIX 파일시스템의 구조
- ![File System-20250117212349017.webp](images%2FFile%20System-20250117212349017.webp)
- 하나의 Partition이 존재
- 크게 4가지로 구성
	- Boot block
		- 어떤 파일 시스템이라도 이 blcok이 먼저 나온다. 메모리에 항상 0번을 올리기 때문
		- 부팅에 필요한 정보 (bootstrap loader)
	- Super block
		- 파일 시스템에 관한 총체적인 정보를 담고 있다. (어디가 빈 블록이고, 어디에 파일이 사용중인지 관리)
	- Inode list
		- 실제 directory에는 모든 메타데이터를 가지고 있지 않다. inode 하나가 file 하나씩 할당되고, 이 inode는 metadata를 가지고 있다. 파일의 이름은 가지고 있지 않다.
		- 파일의 이름은 directory가 직접 가지고 있고, 파일에 대한 inode 번호를 가지고 있다.
		- 파일의 위치정보는 indirect로 위치를 표현한다. single, double, triple 로 위치를 가리킨다.
		- 큰파일은, indirect를 따라가면 파일의 위치가 있는 block이 있고, 그곳을 찾아 들어가게 된다.
		- 파일의 크기에 따라 단계가 낮다.
	- Data block
***
## 7. FAT file System
- ![File System-20250117212353800.webp](images%2FFile%20System-20250117212353800.webp)
- FAT : 위치정보만 FAT이 가지고 있다. 나머지 메타데이터는 directory file이 가지고 있다.
	- 중간에 bad sector가 나오면 뒷부분이 모두 잘못되어 버린다.
	- FAT이라는 배열에 크기에, 디스크가 관리하는 갯수 만큼 block이 있고, 각 block은 다음 block이 어딘지 나타내고 있다. linked list와 같이. 217-> 두번째 블록? -> FAT의 217 을 간다. -> 618 이런식으로 확인
	- 직접접근이 가능하게 된다.
	- Linked allocation의 단점을 모두 극복
- 실제로는 상당히 많은 파일시스템들이 있다.
***
## 8. Free-Space Management
- 비어있는 맵들을 관리하는 방법
- Bit map or bit vector
	- 각각의 block별로 번호가 존재한다. Unix의 경우 Super block을 두고, 첫번째 block이 사용중인지, 아닌지를 bit 로 표시 
- Linked Free Space List on Disk - 비어있는 부분의 첫번째 위치만 point로 가지고 있고 그 block에 가면, 다음 빈공간을 표시
	- 공간의 낭비는 없지만 연속적인 가용공간을 찾는 것은 쉽지 않다.
- Grouping
	- linked list 방법의 변형 
	- 첫번째 free block이 n개의 pointer를 가짐
	- n-1 pointer는 free data block을 가리킴
	- 마지막 pointer가 가리키는 block은 또 다시 n pointer를 가짐
- Counting
	- 프로그램들이 종종 여러 개의 연속적인 block을 할당하고 반납한다는 성질에 착안
	- 빈블록의 위치 + 연속적으로 몇개가 비었는지 정보를 가지고 있음.
***
## 9. Directory Implementation
- Linear List
	- file의 이름고 metadata를 list로 구성(크기를 고정)
	- 구현이 간단
	- 디렉토리 내에 파일이 있느니 찾기 위해서는 linear search필요
- Hash Table
	- linear list + hashing
	- Hash table 은 file name 을 이 파일의 linear list의 위치로 바꾸어줌
	- Hash 함수는 어떤 이름을 지정하더라도 Hash안에 결과값은 범위 안에 값으로 한정이 된다.
	- Hash 함수의 결과값에 entry를 저장한다.
	- Collision 발생이 가능 -> 다른 이름이 같은 값으로 될 가능성
- Long file name 의 지원
	- 긴 이름의 파일은 길이를 한정을 해놓고, 앞부분은 저장을하고, 길어서 entry를 벗어나게 되면, 맨 끝은 pointer로 놓고 저장을 한다.
***
## 10. VFS, NFS
- VFS(Virtual File System) : 파일시스템은 다양하지만, 서로 다른 다양한 파일 시스템에 대해 동일한 시스템 콜 인터페이스(API)를 통해 접근할 수 있게 해주는 OS의 layer
- NFS(Network File System) : 분산 시스템에서는 네트워크를 통해 파일이 공유될 수 있다. NFS 는 분산 환경에서의 대표적인 파일 공유 방법
- ![File System-20250117212400702.webp](images%2FFile%20System-20250117212400702.webp)
***
## 11. Page Cache and Buffer Cache
- Page Cache : Virtual memory의 paging system에서 사용하는 page frame을 caching의 관점에서 설명하는 용어
	- Memory-Mapped I/O를 쓰는 경우 file의 I/O에서도 page cache 사용
- Memory-Mapped I/O
	- File의 일부를 virtual memory에 mapping 시킴
	- 매핑시킨 영역에 대한 메모리 접근 연산은 파일의 입출력을 수행하게 함
- Buffer Cache
	- 파일 시스템을 통한 I/O연산은 메모리의 특정 영역인 buffer cache사용
	- File 사용의 locality 활용
	- LRU,LFU 등 알고리즘 사용 할 수있다.
- Unified Buffer Cache
	- 최근의 OS에서는 기존 buffer cache가 page cache에 통합된다.![File System-20250117212414305.webp](images%2FFile%20System-20250117212414305.webp)]