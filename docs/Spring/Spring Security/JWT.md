***
## 1. JWT
- Json 객체를 이용해 정보를 안전하게 전달하는 토큰
- Json Web Tocken
- Header - payload - Signature 의 형태로 저장
	- Header : 알고리즘방식과 type 
		- 토큰의 유형과 토큰의 서명 알고리즘을 저장. 
	- payload : Id, 이름, 발급시간 등의 내용. 정보를 저장
	- signature : 보안을 강화하기 위한 암복호화의 알고리즘이 저장. 해당 key를 집어넣어야 해석이 가능
		- 토큰의 무결성을 보증, 안전성 확보
- JWT 의 작동 방식 : 사용자 로그인 -> 토큰 생성 -> 토큰을 Http header 또는 url parameter로 전달 -> 정보와 권한을 추출  
- 장점 
	- 보안성 강화 : 서명을 통해 보안성을 강화함. 중앙서버의 부하를 줄임.
	- 확장성 및 호환성 : stateless를 가짐. 다양한 플랫폼과 서비스에서 사용가능
	- 효율적인 인증 및 권한 부여 : 각 요청마다 데이터베이스 요청을 줄이며 효율성이 증가
	- 자가 수용적 특성 : 모든 내용을 자체적으로 포함하고 있으며 네트워크 오버헤드를 줄임
	- 단일 로그인 구현 용이성 
	- 디버깅과 테스팅의 용이성
***
## 2. JWT 로그인 시스템 구축
- 인증 프로세스
	- 사용자 인증 단계 : ID, PW
	- JWT 생성 및 발급 
	- 클라이언트 측 JWT 처리 : 토큰에 모든 요청에 포함. 보통 HTTP 헤더에 포함
	- 서버에서의 JWT 검증 : 토큰의 서명을 확인하는 과정
	- 권한부여 및 리소스 접근 : 사용자의 역할에 따라 적절한 권한 부여
	- 토큰 만료 및 갱신 
- 의존성 설정
	```JAVA
	dependecies {
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'com.auth0:java-jwt'
	}
	```
- Spring Security 에서 JWT 설정
	```Java
	@EnableWebSecurity
	public class SecurityConfig extends WebSecurityConfigurerAdapter{
		@Override
		protected void configure(HttpSecurity http) throws Exception{
			http
				.csrf().disable()
				.authorizeRequests()
				.antMachers("/api/public/**).permitAll()
				.anyRequest().authenticated()
				.and()
				.addFilter(new myCustomJwtFilter(authenticationManager()));
		}
	}
	```
	 Spring Security 설정 파일에서 커스텀된 jwt 필터를 통해 모든 요청에 대해 토큰을 검증하는 과정이 필요(myCustomJwtFilter)
- JWT 생성 및 파싱 로직
	```Java
	public class JwtUtil{
	private static final String SECRET_KEY = "your_secret_key";
	
	public static String createToken(String username){
		return JWT.create()
			.withSubject(username)
			.withExpriresAt(new Date(System.currentTimeMillis()+(60*60*24)))
			//24시간유효
			.sign(Algorithm.HMAC512(SECRET_KEY));
	}
	public static String getUsernameFromToken(String token){
		return JWT.require(Algorithm.HMAC512(SECRET_KEY))
			.build()
			.verify(token)
			.getSubject();
		}
	}
	```
	 JWT 생성 및 파싱 로직을 객체를 통해 제공해주어야 한다. 토큰 생성 로직은 username을 넣어서 만들게 됨. SECRET_KEY를 통해 알고리즘에 접근 할 수 있도록 보안강화.
	 꺼내올 때도 token을 넣어주어 username을 꺼내올 수 있도록 함.
 - Custom 인증 필터
	 ```Java
	 public class MyCustomJwtFilter extends UsernamePasswordAuthenticationFilter{
	 @Override
	 protected void doFilterInternal(HttpServletRequest request, HttpServeltResponse response, FilterChain chain){
		 String token = request.getHeader("Authorization");
			 if(!tokenUtil.validate(token)){
				 throw new RuntimeException("인증이 올바르지 않습니다.");
			 }
		 chain.doFilter(request,response); //요청을 다음 filter나 servelt으로 넘긴다.
		 }
	 }
	```
	config에서 filter 설정을 해주었다 
	- request요청이 올 때마다 header에서 토큰을 꺼내고 validation을 진행
