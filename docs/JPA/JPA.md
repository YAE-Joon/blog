***
## 1. JPA란
***
- JPA : Java Persistence API, ORM 데이터 접근 기술. JPA는 SQL을 개발자 대신 작성하고 처리해준다. 
- ORM : Object-relational mapping(객체 관계 매핑): 객체는 객체대로 설계하고, 관계형 데이터베이스는 관계형 데이터베이스대로 설계, ORM 프레임워크가 중간에서 매핑해준다. 대중적인 언어에는 대부분 ORM기술이 존재
- JPA의 장점 
	- SQL 중심적인 개발에서 객체 중심으로 개발
	- 생산성
	- 유지보수
	- 패러다임의 불일치 해결
	- 성능
	- 데이터 접근 추상화와 벤더 독립성
	- 표준

## 2. 영속성 관리
***
- 영속성 컨텍스트 : 엔티티를 영구 저장하는 환경 이라는 뜻
- 엔티티 매니저를 통해서 접근이 가능하다.
- 엔티티의 생명주기
	- 비영속(new/transient) : 영속성 컨텍스트와 전혀 관계가 없는 새로운 상태
		- ex) 객체만 생성된 상태   ```Member member = new Member();	
							member.setId("member1");
							member.setUsername("회원1");```
	- 영속(managed) : 영속성 컨텍스트에 관리되는 상태
		- ex) 객체를 저장한 상태 (영속) `em.persist(member);`
	- 준영속(detached) : 영속성 컨텍스트에 저장되었다가 분리된 상태
		- 이미 데이터베이스에서 저장된 뒤에 조회, 영속성 컨택스트가 더이상 관리하지 않는 엔티티이다.(식별자(id)가 존재하기 때문에,)
		- 관리 상태가 아니기 때문에, dirty check을 하지 않는다. 데이터 변경한다고 해도 persist가 일어나지 않는다.
		- ex) 회원 엔티티를 영속성 컨텍스트에서 분리, 준영속 상태 
			`em.detach(member)`
	- 삭제(removed) : 삭제된 상태
		- ex) `em.remove(member);`
	 ![JPA-20250117220657145.webp](images%2FJPA-20250117220657145.webp)

## 3. 영속성 컨텍스트의 특징
***
- 1차 캐시 : 엔티티를 persist하게 되면 영속 컨텍스트 안에 1차 캐시로 들어가게 된다. 영속성컨텍스트 안에 존재하는 엔티티는 1차캐시에서 조회가 된다. 만약 1차캐시에 존재하지 않는 경우에, DB에 sql을 날리고, 1차캐시로 저장하여 반환한다.
![JPA-20250117220701685.webp](images%2FJPA-20250117220701685.webp)
- 동일성 보장 : 조회를 1차 캐시에서 하기 때문에, 반복가능한 읽기가 애플리케이션 차원에서 가능하다.
- 트랜잭션을 지원하는 쓰기 지연  : 트랜잭션은 엔티티매니저가 데이터 변경시 트랜잭션을 시작한다. persist에 의해 영속 컨텍스트 1차캐시에 저장하고, 커밋되는 순간에 데이터베이스에서 INSERT SQL을 보낸다.INSERT SQL 은 영속 컨텍스트 안에 쓰기 지연 SQL 저장소에서 SQL이 저장된다. commit이 되는 즉시 flush 를 해서 sql 을 날린다.
- 변경감지 : 1차캐시에는 스냅샷이 존재한다. flush 하는 경우 이 스냅샷과 Entity가 변경된 부분이 있으면 자동으로 UPDATE SQL을 DB에 날리게 된다.

## 4. flush
***
- flush : 영속성 컨텍스트의 변경내용을 데이터베이스에 반영. 아래의 경우 flush 가 발생한다.
	- 변경감지
	- 수정된 엔티티 쓰기 지연 SQL 저장소에 등록
	- 쓰기 지연 SQL 저장소의 쿼리를 데이터베이스에 전송
- flush 하는 법 :
	- em.flush() : 직접 호출
	- 트랜잭션 커밋 : 자동 호출
	- JPQL 쿼리 실행 : 자동 호출
- flush 했다고 해서 영속성 컨텍스트가 비워지지 않는다. 단순히 영속성 컨텍스트의 변경내용을 데이터베이스에 동기화하는 것. 트랜잭션 작업단위가 중요하다.

## 5. 준영속 상태
***

- 영속 상태의 엔티티가 영속성 컨텍스트에서 분리(detached)되는 것을 준영속상태라고 한다.
- 영속성 컨텍스트의 기능을 사용하지 못한다.
- em.detach(entity) : 특정 엔티티만 준영속 상태로 전환
- em.clear() : 영속성 컨텍스트를 완전히 초기화
- em.close() : 영속성 컨텍스트 종료

## 6. JPA 적용
***
	- `@Entity` : JPA가 사용하는 객체라는 의미. 이 annotation으로 JPA가 인식
	- `@Id` : 테이블의 PK와 해당 필드를 매핑한다.
	- `@GeneratedValue(strategy = GenerationType.IDENTITY)` : PK생성값을 어떻게 처리할지 설정. IDENTITY는 데이터베이스에서 생성한다.
	- `@Column` : 객체 필드를 테이블의 컬럼과 매핑.
		- `name = "item_name` : 테이블 컬럼의 이름 지정
		- `length = 10` : JPA의 매핑정보로 DDL(create table)도 생성할 수 있는데, 그때 컬럼의 길이 값으로 활용(varcher 10)
		- item_name 은 itemname과 동일하여 생략해도 된다. (자동변환)
	- JPA 는 public 또는 protected 의 기본 생성자가 필수이다.
```JAVA
@Slf4j
@Repository 
//@Repository가 붙은 클래스는 컴포넌트 스캔의 대상이 된다. 예외 변환 AOP의 적용대상이된다.
@Transactional //모든 JPA 데이터변경은 트랜잭션 안에서 이루어져야 한다. 조회의 경우는 없어도 가능
//보통은 Transaction은 서비스계층에서 걸어준다.(비지니스 로직을 시작하는 곳이기 때문)
public class JpaItemRepositoryV1 implements ItemRepository {

    private final EntityManager em;
	/**EntityManger를 주입받는다. JPA는 이 매니저내부에 데이터소스를 가지고 있고, 데이터베이스에 
	접근	할 수 있다.**/ 
    public JpaItemRepositoryV1(EntityManager em) {
        this.em = em;

}

    @Override    
    public Item save(Item item) {
        em.persist(item);
        //엔티티 매니저가 제공하는 persist()메서드를 사용
        return item;
    }

    @Override    
    public void update(Long itemId, ItemUpdateDto updateParam) {
        Item findItem = em.find(Item.class, itemId);
        findItem.setItemName(updateParam.getItemName());
        findItem.setPrice(updateParam.getPrice());
        findItem.setQuantity(updateParam.getQuantity());
	}
	/**update의 경우 메서드를 호출하지않아도, JPA는 트랜잭션이 커밋되는 시점에서 영속성 컨택스트에서 
	변경된 엔티티 객체의 경우 자동적으로 UPDATE해주게 된다. **/
    @Override    
    public Optional<Item> findById(Long id) {
        Item item = em.find(Item.class, id);
        return Optional.ofNullable(item);
    }
     
	@Override    
	public List<Item> findAll(ItemSearchCond cond) {
        String jpql = "select i from Item i";
        Integer maxPrice = cond.getMaxPrice();
        String itemName = cond.getItemName();
        if (StringUtils.hasText(itemName) || maxPrice != null) {
            jpql += " where";
		}
		
        boolean andFlag = false;
        if (StringUtils.hasText(itemName)) {
            jpql += " i.itemName like concat('%',:itemName,'%')";
            andFlag = true;
        }
		
		if (maxPrice != null) {
			if (andFlag) {
				jpql += " and";
			}
	        jpql += " i.price <= :maxPrice";
        }
        
        log.info("jpql={}", jpql);
		
        TypedQuery<Item> query = em.createQuery(jpql, Item.class);
        if (StringUtils.hasText(itemName)) {
            query.setParameter("itemName", itemName);
        }
		
        if (maxPrice != null) {
            query.setParameter("maxPrice", maxPrice);
		}
        return query.getResultList();
    }
}
```

## 7. 연관관계
***
- 연관관계 : 자바에서는 객체 지향적인 관점으로 참조를 사용해서 연관된 객체를 찾고, 테이블은 외래키를 활용해 조인 방식을 사용해서 연관된 테이블을 찾는다. 이러한 방식의 차이 때문에, 객체를 테이블에 맞춰 데이터 중심으로 모델링하면 협력 관계를 만들 수 없다.


<h3>7.1 단방향, 양방향</h3>
- 테이블 
	-외래 키 하나로 양쪽 조인이  가능, 방향의 개념이 없다.
- 객체
	-참조용 필드가 있는 쪽으로만 참조 가능, 한쪽만 참조하면 단방향, 양쪽이 서로 참조하면 양방향

<h3>7.2 연관관계의 주인</h3>
- 테이블은 외래 키 하나로 두 테이블이 연관관계를 맺음.
- 객체 양방향 관계는 A->B, B->A처럼 참조가 양쪽으로 이루어진다
- 이 둘중 테이블의 외래키를 관리할 곳을 지정해야 함.
- 연관관계의 주인 : 외래 키를 관리하는 참조
- 주인의 반대편: 외래 키에 영향을 주지않고 단순 조회만 가능하다.

<h3>7.3 다대일 단반향</h3>

- 다대일 일경우 외래키는 항상 다수 쪽에 있어야한다.
- 반대로 참조하는 로직이 많을경우, OneToMany annotation을 이용하여 조회할수 있다. (주인은 ManyToOne 임)

<h3>7.4 일대다 단반향</h3>

- Team 은 members 객체가 있는 경우, members 가 member 로 가는 일대다 단방향을 할 수 있다.
- 데이터베이스의 입장에서는 외래키는 결국 member에 있기 때문에, Team에서 persist 하게될시, member객체도 결국 update를 해주어야 하는 상황이 발생한다.따라서 update쿼리문이 나가게 된다.
- 객체와 테이블의 차이 떄문에 반대편 테이블의 외래 키를 관리하는 특이한 구조
- JoinColumn 을 꼭 사용해야한다. 그렇지 않으면 조인 테이블 방식을 사용하게 된다.(테이블 사이에 새로운 테이블이 생김, 성능상 다운)
- 다대일 양방향 매핑이 일대다 단반향 매핑보다 낫다.
- 일대다 양방향의 경우, @ManyToOne, @JoinColumn(name ="Team_id" insertable = false, updatable =false) annotation 을 걸어야함. 이렇게 하면, 읽기 전용이 된다.
- 읽기 전용 필드를 사용해서 양방향처럼 사용할 수 있다.

<h3>7.5 일대일 관계</h3>

- 일대일 관계는 그 반대도 일대일
- 주 테이블이나 대상 테이블 중에 외래 키 선택 가능
	- 주 테이블에 외래키
	- 대상 테이블에 외래 키
- 외래 키에 데이터베이스 유니크(UNI) 제약조건 추가
- 대상 테이블에 외래키가 있는 경우에, 단방향의 경우 JPA가 지원하지 않는다. 이 경우에는 양방향 매핑을 통해 해결할 수 있다.

<h2>8. 연관관계 매핑</h2>
***

- annotation방식으로 연관관계 매핑을 할 수 있다. 
	- 객체와 테이블 매핑 : `@Entity`, `@Table`
		- `@Table` 속성 
			- name : 매핑할 테이블 이름
			- catalog : 데이터베이스 catalog 매핑
			- schema : 데이터베이스 schema 매핑
			- uniqueConstraints(DDL) : DDL 생성 시 유니크 제약 조건 생성
	- 필드와 컬럼 매핑 : `@Column`
		- `@Column` 속성
			- name : 필드와 매핑할 테이블의 컬럼 이름
			- insertable, updatable : 등록 변경 가능 여부
			- nullable(DDL) : null값의 허용 여부. false로 설정시 DDL생성시 not null 제약조건이 붙는다.
	- 기본 키 매핑 : `@Id`
	- 연관관계 매핑 : `@ManyToOne`,`@JoinColumn`
	- 날짜 타입 매핑 : `@Temporal`
	- enum 타입 매핑 : `@Enumerated`
	- BLOB, CLOB 매핑 : `@Lob`
	- 특정 필드를 컬럼에 매핑하지 않음(매핑 무시) : `@Transient`

<h2>9. 상속관계 매핑</h2>
***
 
 - 관계형 데이터베이스는 상속관계가 없고, 슈퍼타입 서브타입 관계라는 모델링 기법이 객체 상속과 유사하다. 상속간계 매핑은 이 객체의 상속, DB의 슈퍼타입 서브타입 관계를 매핑한다.
 - 슈퍼타입 서브타입 관계를 매핑하는법
	 1. JOIN을 이용해서 데이터타입을 넣고, insert를 두번씩 하는 것.(각각 테이블로 변환)
		 - 장점 : 테이블의 정규화, 외래 키 참조 무결성 제약조건 활용가능, 저장공간 효율화
		 - 단점 : 조회시 조인을 많이 사용, 성능 저하, 조회 쿼리가 복잡함. 데이터 저장시 INSERT SQL 2번 호출
	 2. 논리모델을 하나의 테이블로 관리 : 모든 내용을 한 테이블에 넣고, 데이터타입을 마지막에 추가한다.
		 - 장점 : 조인이 필요 없기 때문에 일반적으로 조회 성능이 빠르다. 조회 쿼리가 단순하다.
		 - 단점 : 자식 엔티티가 매핑한 컬럼은 모두 null이 허용, 단일 테이플에 모든것을 저장하므로 테이블이 커질 수 있고, 상황에 따라서 조회 성능이 오히려 느려질 수 있다.
	 3. 구현 클래스마다 테이블 전략. 서브타입 테이블에 내용들은 각각 넣는 것(Item table을 없앰.)
		 - 장점 : 서브 타입을 명확하게 구분해서 처리할 때 효과적, not null 제약조건 사용 가능
		 - 단점 : 여러 자식 테이블을 함께 조회할 때 성능이 느림(UNION SQL), 자식 테이블 통합해서 쿼리하기 어려움. (데이터베이스 설계자와 ORM 전문가 둘 다 추천 X)
- JPA에서는 3가지 방식 모두 매핑이 가능하다.
	1. `@Inheritance(strategy = InheritanceType.JOINED`
	2.  `@Inheritance(strategy = InheritanceType.SINGLE_TABLE`
	3.  `@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS`
- `@DiscriminatorColumn(name = "")` : DTYPE 이 생기게 되고, entity명이 들어가게 된다. name을 통해 DTYPE 이름을 변경할 수 있다.
- `@DiscriminatorValue("A")` : Dtype에 해당하는 entity명을 A로 바꿀 수 있다.

<h2>10. @MappedSuperclass</h2>
***
- 공통 매핑 정보가 필요할 때 사용(id, name) : 객체에는 계속 id 와 name이 나오는데, 이런 것들을 합쳐서 공통 속성 상속하고 싶을 때 사용한다.
	- ex) 수정날짜, 조회날짜, 만든 날짜 등등
- BaseEntity 를 생성하고, 모든 엔티티에 extends BaseEntity를 한다.(상속) 이 후 BaseEntity에 `@MappedSuperclass` 어노테이션을 붙여준다. (`@Entity`를 붙여주면 안됨)
- 상속관계 매핑이 아니다.
- 엔티티도 아니다. 따라서 테이블과 매핑할 수 없다.
- 부모 클래스를 상속 받는 자식 클래스에 매핑 정보만 제공한다.
- 조회, 검색 불가(em.find(BaseEntity) 불가)
- 직접 생성해서 사용할 일이 없으므로 추상 클래스를 권장