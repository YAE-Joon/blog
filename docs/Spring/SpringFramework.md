***
## 1. 스프링 프레임워크

- 자바 언어 기반의 프레임워크로, 객체 지향 언어가 가진 강력한 특징을 살려내는 프레임 워크
- 핵심 기술: 스프링 DI 컨테이너, AOP,이벤트, 기타
- 웹 기술 : 스프링 MVC, 스프링 WebFlux
- 데이터 접근 기술 : 트랜잭션, JDBC, ORM 지원, XML지원
- 기술 통합 : 캐시, 이메일, 원격접근, 스케쥴링
- 테스트 : 스프링 기반 테스트 지원
- 언어 : 코틀린, 그루비
***
## 2. 스프링 부트

- 스프링을 편하게 사용할 수 있도록 지원
- 단독으로 실행할 수 있는 스프링 애플리케이션을 쉽게 생성
- Tomcat 같은 웹 서버를 내장해서 별도의 웹 서버를 설치하지 않아도 된다.
- 손쉬운 빌드 구성을 위한 starter 종속성 제공
- 스프링과 3rd party(외부) 라이브러리 자동 구성
- 메트릭, 상태확인, 외부 구성 같은 프로덕션 준비 기능 제공
- 관례에 의한 간결한 설정
***
## 3. IoC
- 제어의 역전(Inversion of Control)
	- 구현 객체들은 자신의 로직을 실행하는 역할만 담당하고, 프로그램의 제어 흐름은 외부에서 동작하는 것을 말한다. 구현 객체들은 로직에 필요한 인터페이스를 호출할 뿐, 실제 어떤 기능이 구현된 객체가 호출되는지는 알지 못한다. 그 구현된 객체를 호출할 권한이 외부에 있는 것을 말한다.
	- ex) 설계 예시 ![Spring-20250117215010876.webp](images%2FSpring-20250117215010876.webp)
```Java 
	import hello.core.discount.DiscountPolicy; 
	import hello.core.discount.RateDiscountPolicy;	
	import hello.core.member.MemberRepository;
	import hello.core.member.MemberService;
	import hello.core.member.MemberServiceImpl;
	import hello.core.member.MemoryMemberRepository;
	import hello.core.order.OrderService;
	import hello.core.order.OrderServiceImpl;
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;
	
	@Configuration
	public class AppConfig {
		
		@Bean    
		public MemberService memberService() {
			return new MemberServiceImpl(memberRepository());
		}
		
		@Bean    
		public OrderService orderService() {
			
			return new OrderServiceImpl(
					
					memberRepository(),
					discountPolicy());
	}
	
		@Bean    
		public MemberRepository memberRepository() {
	
			return new MemoryMemberRepository();
		}
	
		@Bean    
		public DiscountPolicy discountPolicy() {
	
			return new RateDiscountPolicy();
		}
	
  }
```
- 위 설계를 보면, Service나 Repository 는 인터페이스로 객체를 구성하였고, 이 Service나 Repository의 실제 구현체는 이 인터페이스를 상속받아서 여러 객체를 구현하였다.
- #### **구현 객체들은 자신의 로직을 실행하는 역할만 담당 
	- 인터페이스를 호출하였기 때문에 어떤 객체가 구현되는지 이를 호출한 객체들은 알 수 없다.
- #### 제어의 흐름은 외부에서 동작 
	- AppConfig 객체에서 각 인터페이스에 어떤 구현체를 넣어줄지를 결정한다.
	
***
## 4. DI

- 의존관계 주입(Dependency Injection)
- 애플리케이션 실행 시점에 외부에서 실제 구현 객체를 생성하고 클라이언트에 전달해서 클라이언트와 서버의 실제 의존관계가 연결 되는 것을 의존관계 주입이라고 한다.
- 정적인 클래스 의존 관계와 실행 시점에 결정되는 동적인 객체 의존 관계로 나눠서 생각해야 한다.
    - 정적인 클래스 의존 관계 : import코드를 보고 확인이 가능한 의존관계로 애플리케이션이 실행되지 않아도 알 수있는 의존관계
    ```Java
    // 정적인 의존 관계
    import hello.core.discount.DiscountPolicy; 
    import hello.core.discount.RateDiscountPolicy;	
    import hello.core.member.MemberRepository;
    ```
  - 동적인 클래스 의존 관계 : 애플리케이션 실행 시점에 실제 생성된 객체 인스턴스의 참조가 연결된 의존 관계
   	 ```Java
    	    // 동적인 의존 관계
        	@Configuration
        	public class AppConfig {
	
            @Bean    
            public MemberService memberService() {
                return new MemberServiceImpl(memberRepository());
            }

  - 위의 예시코드를 보면 memberService의 구현체는 memberServiceImpl 객체로, 실제 객체가 생성시, 이 인스턴스를 통해 참조값이 전달되어서 의존관계가 연결된다.
- DI 컨테이너 : 객체를 생성하고 관리하면서 의존관계를 연결해 주는 것을 DI 컨테이너 또는 IoC 컨테이너라고 한다.

### 4.1 의존관계 주입 방법

- #### 생성자 주입
	- 생성자 호출 시점에 딱 1번만 호출되는 것이 보장된다. 불변, 필수 의존관계에 사용
    ```Java
	// 클라이언트 클래스인 Client 
	public class Client { 
		
		private final Service service;
		 // 생성자를 통해 Service 의존성을 주입받음 
		 public Client(Service service) {
			this.service = service; 
		} 
		 // 서비스 실행 
		 public void performAction() { 
		 service.execute(); 
		 } 
	 }
		```
		
- #### 수정자 주입(setter 주입)
	- 선택, 변경 가능성이 있는 의존관계에 사용된다. 
```Java
	// 클라이언트 클래스인 Client 
	public class Client { 
		
		private final Service service;
		 // 기본 생성자 
		 public Client() {
		} 
		// Service 의존성을 주입하는 setter 메서드 
		public void setService(Service service) { 
		this.service = service; 
		}
		 // 서비스 실행 
		 public void performAction() { 
		 service.execute(); 
		 } 
	 }
   ```
		
- #### 필드 주입
	- 필드에 바로 주입하는 방법, 외부에서 변경이 불가능해서 테스트하기 힘들다.
	```Java
	@Component
	public class Client { 
		
		@Autowired //필드 주입을 위해 Bean으로 등록된 Commponent를 자동 주입
		private Service service;
		
		 // 서비스 실행 
		 public void performAction() { 
		 service.execute(); 
		 } 
	 }
	@Component // Spring이 관리하는 Bean으로 등록 
	public class EmailService implements Service { 
		@Override 
		public void execute() { 
		}
	 }```

- 
	- 구현체를 Spring bean으로 등록하여 바로 필드로 주입하였다.
	
- #### 일반 메서드 주입
	```Java
	@Component // Spring이 관리하는 Bean으로 등록
	public class Client { private Service service; 
	// 메서드를 통한 의존성 주입 
	@Autowired // Spring이 메서드 호출 시 자동으로 주입 
	public void injectService(Service service) { 
	
	this.service = service; 
	
	}
-  마찬가지로 구현체를 Spring bean으로 등력하여 바로 메서드로 주입한다.
- 한번에 여러 필드를 주입 받을 수 있다.
	
- 옵션 처리 : 주입할 스프링 빈이 없어도 동작해야 할 때가 있다. `@Autowired` 만 사용하면 required의 기본값이 true로 되어 있어서 자동 주입 대상이 없으면 오류가 발생한다. 기본값을 false로 설정하거나 `Optional<>`을 사용한다. `Optional<>`은 자동 주입할 대상이 없으면 Optional.empty 가 입력된다.
***
## 5. 스프링 컨테이너
- AppConfig를 사용했던 방식을 ApplicationContext 인터페이스로 가져와서 생성한 인스턴스를 스프링 컨테이너라고 한다. 
![Spring-20250117215020290.webp](images%2FSpring-20250117215020290.webp)
- 컨테이너 구성정보를 AppConfig.class로 지정하게 되면, 이 클래스의 구성 정보들이 컨테이너에 등록되게 된다.
![Spring-20250117215026142.webp](images%2FSpring-20250117215026142.webp)
- `@Bean` annotation이 달린 객체들은 스프링 컨테이너 안에 빈 객체에 자동으로 저장이 된다. 이때 빈의 이름은 따로 지정해 주지 않으면 객체의 이름으로 지정된다.
![Spring-20250117215030756.webp](images%2FSpring-20250117215030756.webp)
- 스프링 컨테이너의 의존관계를 확인 후 자동으로 의존관계를 주입한다. 
- Annotation 정리
	- `BeanFactory` : 스프링 컨테이너의 최상위 인터페이스로, 스프링 빈을 관리하고 조회하는 역할
	- `ApplicationContext` 를 보통 스프링 컨테이너라고 하고, BeanFactory의 기능을 모두 상속받아서 제공한다.여기에 여러 부가기능을 제공한다.
		- 환경변수 처리, 애플리케이션 이벤트, 메세지 소스 활용한 국제화 기능 등
		- 스프링 컨테이너는 인터페이스로 XML기반으로 만들 수 있고, 애노테이션 기반의 자바 클래스로도 만들 수 있다.
		- XML 설정 사용 : 컴파일 없이 빈 설정 정보를 변경할 수 있다.
	- `@Configuration` : 스프링 컨테이너는 이 어노테이션이  붙은 클래스를 구성정보로 사용한다.
		- 앞서 예시로 들었던 AppConfig 객체를 생각하면 된다.
	- `@Bean` : `@Configuration` 이 적힌 클래스의 메서드 중, `@Bean` 이 붙은 메서드를 모두 호출하고, 여기서 반환된 객체를 스프링 컨테이너에 등록한다. 이 등록된 객체를 스프링 빈이라고 한다.
		- 스프링 빈은 `@Bean`이 붙은 메서드의 명을 스프링 빈의 이름으로 사용한다.
		- 스프링 빈은 `applicationContext.getBean()` 메서드로 찾을  수 있다.
- 스프링 컨테이너 생성 과정
	1. 스프링 컨테이너 생성 : 구성정보를 지정해주어야 한다. `@Configuration`으로 지정 가능
	2. 스프링 빈 등록 : 파라미터로 넘어온 설정 클래스 정보를 사용해서 스프링 빈을 등록
	3. 스프링 빈 의존관계 설정
***
## 6. 스프링 빈 설정 메타 정보
  
- 스프링이 다양한 설정 형식을 지원하기 위한 추상화
	- 설정정보는 여러 형식의 파일이 존재한다. Java code로도 할 수 있지만, XML 이나 Groovy 등으로 설정된 다양한 형식의 설정정보를 받아드릴 수 있어야한다.이를 모두 받기 위해 인터페이스로 구현이 된 것이다.
	- 이 설정 형식을 지원할 수 있는 방법은, BeanDefinition을 통해서 각 형식에서 빈 메타정보를 받아오기 때문이다.
- `BeanDefinition` : 빈 설정 메타정보라고 한다. 하나의 Bean 당 하나의 메타정보가 생성된다.
- 스프링 컨테이너는 형식별 ApplicationContext 가 존재한다. 각 형식의 따라 설정정보를 읽고 BeanDefinition을 생성한다.
- `BeanDefinition`정보 
	- BeanClassName : 생성할 빈의 클래스 명
	- factoryBeanName : 팩토리 역할의 빈을 사용할 경우 이름
	- factoryMethodName : 빈을 생성할 팩토리 메서드 지정
	- Scope : 싱글톤
	- lazyInit : 스프링 컨테이너를 생성할 때 빈을 생성하는 것이 아니라, 실제 빈을 사용할 때까지 최대한 생성을 지연 처리하는지 여부
	- initMethodName : 빈을 생성하고, 의존관계를 적용한 뒤에 호출되는 초기화 메서드 명
	- DestoryMethodName : 빈의 생명주기가 끝나서 제거하기 직전에 호출되는 메서드 명
	- Constructor arguments, Properties: 의존관계 주입에서 사용
***
## 7. 싱글톤 컨테이너

- 싱글톤 패턴 : 클래스의 인스턴스가 딱 1개만 생성되는 것을 보장하는 디자인 패턴
	- Config 객체와 같이, 호출할 때마다 연관된 모든 객체를 생성하고 소멸된다면, 자원의 낭비가 매우 심해진다.
	- 이런 자원들은 하나의 인스턴스로 공유하여 관리하기 위한 디자인 패턴이다.
	- 위의 디자인패턴을 사용하기 위해서는 static 영역에 객체 인스턴스를 미리 하나 생성해서 올려두고, private 생성자를 사용해서 외부에서 임의로 new 키워드를 사용하지 못하도록 막아야한다.
```Java	
public class SingletonService {

	//1. static 영역에 객체를 딱 1개만 생성해둔다.  
	private static final SingletonService instance = new SingletonService();

	//2. public으로 열어서 객체 인스턴스가 필요하면 이 static 메서드를 통해서만 조회하도록 허용한 다.
     public static SingletonService getInstance() {
         return instance;
	}

	//3. 생성자를 private으로 선언해서 외부에서 new 키워드를 사용한 객체 생성을 못하게 막는다.
	 private SingletonService() {  
	}
}		
```
- 문제점
		- 의존관계상 클라이언트가 구체 클래스에 의존하게 되어  DIP를 위반한다. 이로 인한 OCP 원칙을 위반할 가능성 높다.
			- 결국 싱글톤으로 만들기위해서는 구현체를 static class로 호출을 해야하기 때문에 IoC가 깨진다.
		- private 생성자로 자식 클래스를 만들기 어렵다.
- 싱글톤컨테이너 : 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤으로 관리하는 스프링 컨테이너 
	- 싱글톤 컨테이너에 스프링빈으로 등록된 인스턴스가 있다면, 그 인스턴스를 호출
	- 스프링빈으로 등록된 인스턴스가 없다면, 컨테이너에 등록 후 호출 
***
## 8. 컴포넌트 스캔

- `@ComponentScan`: `@Component`애노테이션이 붙은 클래스를 스캔해서 스프링 빈으로 등록한다. 
- `@Autowired` : 스프링 빈을 `@Component`를 통해 등록하기 때문에, 의존관계 설정을 직접 해주어야 한다. `@Autowired` 는 스프링 컨테이너가 자동으로 해당 스프링 빈을 찾아서 의존관계를 자동으로 주입해준다.
	- 기본적으로 타입이 같은 빈을 찾아서 주입한다.
	- 생성자에 파라미터가 많아도 다 찾아서 자동으로 주입한다.
	- 주입할 대상이 없으면 오류가 발생한다.
	- 생성자가 1개만 존재하면 `@Autowired`를 생략해도 자동 주입된다.
	- 조회된 빈이 2개 이상일 경우) NoUniqueBeanDefinitionException 이 발생한다. 이름만 다르고 똑같은 타입의 스프링 빈이 2개 있을 때는 해결 할 수 없다.
		- `@Autowired` 필드명 매칭 : 타입매칭을 시도 후 여러 빈이 있으면 필드 이름, 파라미터 이름으로 빈 이름을 추가 매칭한다. 필드명을 파라미터 명으로 빈 이름을 매칭한다.
		- `@Qualifier` : 추가 구분자를 붙여주는 방법이다. 빈이름을 변경하는 것은 아니다.
		- `@Primary` : 우선순위를 정하는 방법. 이 애노테이션이 있는 경우 우선권을 가진다. 만약 `@Qaulifier`와 함께 있는 경우 `@Qualifier`가 우선순위를 가진다.
- 탐색할 패키지의 시작 위치 지정 : 자바 클래스를 모두 컴포넌트 스캔하면 시간이 오래걸려, 꼭 필요한 위치부터 탐색하도록 시작위치를 지정할 수 있다.
	- ex) `@ComponentScan( basePackages = "hello.world")` : `basePackages` 는 탐색할 패키지의 시작 위치를 지정하고, 이 패키지를 포함해 모든 하위 패키지를 탐색한다.
- 컴포넌트 스캔 기본 대상 : 컴포넌트 스캔은 `@Component`뿐만 아니라 다른 내용도 추가로 스캔대상에 포함한다.
	- `@Controller` : MVC 컨트롤러에서 사용, 컨트롤러로 인식
	- `@Service`: 비지니스 로직에서 사용, 특별한 처리를 하지 않지만, 개발자들이 비지니스계층을 인식하는데 도움
	- `@Repository` : 스프링 데이터 접근 계층에서 사용, 데이터 계층의 예외를 스프링 예외로 변환해준다.
	- `@Configuration` : 스프링 설정 정보에서 사용
***
## 9. Lombok
- 생성자, getter, setter, toString() 등, 자주 사용하는 코드들을 자동으로 생성해 주어 코드의 간결함을 높이고 유지보수성을 개선해주는 라이브러리
- `@RequiredArgsConstructor` : final이 붙은 필드를 모아서 생성자를 자동으로 만들어주는 기능
- `@NoArgsContructor` : 기본 생성자를 만드는 데 사용
- `@AllArgsConstructor` : 모든 필드의 생성자를 만드는데 사용 


Reference : https://www.inflearn.com/course/스프링-핵심-원리-기본편