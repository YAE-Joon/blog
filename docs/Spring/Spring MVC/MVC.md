
## 1. 서블릿(Servlet)
***
- **서블릿**: 자바를 기반으로 웹 애플리케이션을 개발할 때, 클라이언트의 요청을 처리하고, **동적**으로 응답을 생성하는 서버 측 컴포넌트
-  HTTP 요청/응답을 처리하는 데 사용되며, 웹 서버와 클라이언트(웹 브라우저) 간의 통신을 담당
- **HttpServletRequest**: HTTP 요청 메시지를 파싱하여 편리하게 제공.
- **HttpServletResponse**: HTTP 응답 메시지 생성을 돕는 객체.
-  서블릿과 JSP의 차이
	서블릿과 JSP(Java Server Pages)는 자바 기반의 웹 애플리케이션을 개발할 때 사용되지만, 그 목적과 사용 방식에서 차이
	- **서블릿**: 자바 코드로 구성된 서버 측 로직을 처리하는 클래스
		- 클라이언트의 요청을 받고, 비즈니스 로직을 처리한 후 결과를 응답
	- **JSP**: HTML과 자바 코드를 결합한 템플릿 엔진. 동적 웹 페이지를 생성하는 데 사용
	- 서블릿은 주로 비즈니스 로직을 처리하고, JSP는 뷰를 처리하는 데 사용

## 2. MVC 구조와 흐름
***
- **MVC (Model-View-Controller)** : 비즈니스 로직을 컨트롤러에서 수행하고, 화면에 보이는 것은 뷰(View)에서 처리하며, 데이터는 모델(Model)에 저장하는 구조 
  이를 통해 비지니스 로직과 뷰 로직을 분리하여 유지보수에 적합한 코드 설계

#### 2.1 비지니스 로직과 뷰 로직을 분리하게 된 과정
	
 2.1.1 중복 코드: 뷰로 이동하는 코드가 여러 컨트롤러에서 반복되며, 공통 처리가 어렵다.
	  - `RequestDispatcher`를 이용한 중복된 코드
		  - HttpSevlet Request 와 Response의 데이터를 Dispatcher로 접근해서 원하는 데이터를 꺼내오고 전달해야 한다.  가져오는 데이터만 다를 뿐 이 흐름은 모든 과정에서 동일하기 때문에 같은 코드가 중복해서 작성될 수 밖에 없다.   
    - 해결책: 이 중복되는 코드들을 공통으로 처리하는 부분으로 묶고, 공통 처리 부분을 Front Controller로 분리
	
2.1.2 **Front Controller 중복코드의 최적화**:
	1. HttpServletRequest와 Response를 직접 받아서 원하는 jsp에 넘겨주도록 설계
	```Java
public void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
 String username = request.getParameter("username");
 int age = Integer.parseInt(request.getParameter("age"));
         Member member = new Member(username, age);
         memberRepository.save(member);
         request.setAttribute("member", member);
         String viewPath = "/WEB-INF/views/save-result.jsp";
         RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
         dispatcher.forward(request, response);
		} }```
		
-  데이터를 viewPath에 넘겨줘야하는 코드들이 계속해서 중복으로 발생한다.
		```Java
		String viewPath = "/WEB-INF/views/new-form.jsp"
		RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);
		dispatcher.forward(request, response);
		```
	2. View 객체를 공통적으로 만들어 공통된 코드를 분리하고, 해당 View를 표현할 viewPath로 이동하도록 viewPath를 반환하도록 설계
	```Java
	public void render(HttpServletRequest request, HttpServletResponse response)
	 throws ServletException, IOException {

     RequestDispatcher dispatcher = request.getRequestDispatcher(viewPath);

     dispatcher.forward(request, response);
 	}```
-  랜더링되는 부분을 객체로 만들어서 최적화를 진행한다.
	3. 서블릿 종속성과 뷰 이름의 중복을 제거
		- HttpServeletRequest와 Response 전체를 받아서 서블릿 기술에 종속받도록 설계하지 않고, 필요한 데이터들을 별도의 객체를 만들어 반환한다면 굳이 파라미터로 request, response를 받지 않아도 된다.
		- 마찬가지로, viewPath의 위치를 표현하는 물리적인 이름은 중복이 된다. 보통 같은 위치에 저장하기 때문. 이 또한 최적화를 통해 논리이름만 반환하도록 할 수 있다.
    4.  핸들러 어댑터를 추가하여 원하는 컨트롤러를 선택적으로 사용할 수 있도록 구현하면, 원하는 컨트롤러를 원하는 순간에 사용하도록 코드를 짤 수 있다. 
- 이를 통해 비지니스 로직과 뷰 로직을 분리하여 유지보수에 적합한 코드 설계

## 3. Spring MVC 구조
***
![MVC-20250117214929694.webp](images%2FMVC-20250117214929694.webp)

스프링 MVC는 **DispatcherServlet**을 중심으로 동작하며, HTTP 요청을 처리하고 응답을 생성하는 일련의 흐름을 체계적으로 관리

1. **DispatcherServlet**이 서블릿으로 등록되고, 모든 HTTP 요청을 처리.
2. `service()` 메서드 호출 후, `DispatcherServlet.doDispatch()`로 요청 처리.
3. **Handler** 조회 후 **HandlerAdapter**가 Handler를 실행.
4. **ModelAndView** 객체 반환 및 View rendering.
5. **ViewResolver**로 논리적 뷰 이름을 물리적 경로로 변환하여 최종 뷰 반환.

## 4. Handler Mapping
***
-  스프링 MVC에서 컨트롤러가 호출되기 위해서는 2가지 조건이 필요하다.
	1. 컨트롤러가 호출되기 위해서는 핸들러 매핑에서 이 컨트롤러를 찾을 수 있어야한다.
	2. 핸들러 매핑을 통해 찾은 핸들러를. 실행할 수 있는 핸들러 어댑터가 필요하다.
- HandlerMapping 은 anotation 기반의 컨트롤러인 `@RequestMapping`에서 사용한다.(99%)  또는 스프링 빈의 이름으로 찾을 수도 있다.
- HandlerAdapter 또한 `@RequestMapping` 에서 사용, 조회한다.

## 5. View Resolver
***
- 핸들러 어댑터를 통해 논리 뷰 이름(post)를 획득한다.
- View Resolver가 호출된다.
- post 라는 뷰이름으로 viewResolver를 순서대로 호출한다. 이 때 viewResolver에 순위가 있다.
	- BeanNameViewResolver : post 이름을 가진 스프링 빈으로 등록된 뷰를 찾는다.
	- InternalResourceViewResolver, JSP처럼 포워드를 호출해서 처리할 수 있는 경우 사용
	- Thymeleaf 뷰 템플릿의 경우 `ThymeleafViewResolver`를 등록해야 한다. 라이브러리만 추가하면 스프링부트가 자동화한다.
	- `view.render()` 가 호출되면서 렌더링 된다.

## 6. 스프링 MVC 애노테이션
***
- `@RequestMapping` : RequestMappingHandlerMapping, RequestMappingHandlerAdapter 를 지원한다. 스프링이 이 매핑정보를 등록하고 애노테이션에서 HttpRequest가 오면 해당 URL이 호출시 이 메서드가 호출된다.
- `Controller`: 스프링이 자동으로 스프링 빈으로 등록한다. 내부에 `@Component` 애노테이션이 있어서 컴포넌트 스캔의 대상이 된다. 
- `@RequestParam` : Http 요청 파라미터를 애노테이션 기반으로 받을 수 있다. `@RequestParam("username")` = `request.getParameter("username)`과 거의 같은 코드이다.
- `@GetMapping`,`@PostMapping` : Http Method도 함께 구분할 수 있다.
- `@RestController` : `@Controller` 에서는 반환 값이 String 이면 뷰 이름으로 인식된다. 이를 통해 뷰를 찾고, 뷰가 랜더링 된다. `@RestController` 는 반환값으로 뷰를 찾는 것이 아니라, HTTP 메세지 바디에 바로 입력한다. 
- `@PathVariable` : URL 경로를 템플릿화 할 수 있는데, 매칭되는 부분을 편리하게 조회할 수 있다. `@PathVariable`의 이름과 파라미터 이름이 같으면 생략할 수 있다. 
- `@ModelAttribute` : 요청 파라미터를 받아서 필요한 객체를 만들고 그 객체에 값을 넣어주어야 하는 과정을 완전히 자동화 해준다.
	- 객체를 생성한다.
	- 요청파라미터의 이름으로 객체에서 객체의 프로퍼티를 찾는다. 해당 프로퍼티가 존재하면 setter()를 호출해서 파라미터 값을 입력(바인딩)한다.