***
## 1. JDBC의 등장
애플리케이션 서버와 DB의 연결
-애플리케이션을 개발할 때 중요한 데이터는 대부분 데이터베이스에 보관한다. 이 때 3가지 단계를 거쳐서 통신.
	1. 커넥션 연결 : TCP/IP 를 사용해서 커넥션을 연결
	2. SQL 전달 : 애플리케이션 서버는 DB가 이해할 수 있는 SQL을 연결된 커넥션을 통해 DB에 전달
	3. 결과 응답 : DB는 전달된 SQL을 수행하고 그 결과를 응답. 애플리케이션 서버는 응답 결과를 활용
-위 과정에서의 문제점 : 3가지 방식이 여러 데이터베이스마다 다르다. 수십개의 RDB마다 각각의 방식에 따라 커넥션하고 ,SQL이 존재하고, 결과에 응답받는 방식이 다르다. 데이터베이스 변경시 애플리케이션 서버에 개발된 데이터베이스 사용 코드도 함께 변경해야함.
JDBC 는 이러한 문제해결을위해 JDBC (Java Database Connectivity)표준 인터페이스를 제공하여 데이터베이스마다의 Connection ,SQL전달 , Resultset 을 만들도록 드라이버를 제공하였음.
***
## 2. DB의 연결

JDBC를 사용해서 실제 데이터베이스에 연결하기 위해서는 Connection 을 호출하면 된다.
- JDBC 에서는 DriverManger.getConnection(URL.USERNAME,PASSWARD)를 사용하면 된다. 이렇게 하면 라이브러리에 잇는 데이터베이스 드라이버를 찾아서 해당 드라이버가 제공하는 커넥션을 반환한다.
	ex) `Connection connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);`
- DriverManager는 실제 라이브러리에 등록된 DB드라이버를 자동으로 인식, 정보를 넘겨서 커넥션을 획득할 수 있을지 확인.
- 이렇게 찾은 커넥션 구현체가 클라이언트에 반환
![JDBC-20250117221248004.webp](images%2FJDBC-20250117221248004.webp)

***
## 3. JDBC CRUD

- JDBC를 사용하여 커넥션획득, sql문을 db로 보내고, 결과를 요청하는 기본적인 등록,조회,수정, 삭제를 할 수 있다. 
- 등록
```JAVA
package hello.jdbc.repository;

 import hello.jdbc.connection.DBConnectionUtil;
 import hello.jdbc.domain.Member;
 import lombok.extern.slf4j.Slf4j;

 import java.sql.*;

/**  
* JDBC - DriverManager 사용 
* */

 @Slf4j 
 public class MemberRepositoryV0 {

     public Member save(Member member) throws SQLException {
         String sql = "insert into member(member_id, money) values(?, ?)"; 
		//sql 문을 String 타입으로 작성한다.
         Connection con = null;
         PreparedStatement pstmt = null; 
         //statment 의 자식 타입으로, ?에 파라미터 바인딩을 가능하게 한다.

         try {
             con = getConnection(); 
             pstmt = con.prepareStatement(sql); /**데이터베이스에 전달할 SQL과 파라미터로 
             전달할 데이터들을 준비 **/
             pstmt.setString(1, member.getMemberId()); /**SQL문의 첫번째 ?에 지정된 
             String 값을 넣는다.**/
             pstmt.setInt(2, member.getMoney()); /**SQL문의 두번째 ?에 지정된 Int
              값을 넣는다.**/
             pstmt.executeUpdate();/** SQL문을 데이터베이스로 전달한다. 이때 DB의 row를 
             int로 반환한다.**/
             return member;

         } catch (SQLException e) {
             log.error("db error", e);
             throw e;

         } finally {
             close(con, pstmt, null); 
             //connection 과 , preparedStatement, ResultSet을 닫아주어야 한다.
             //예외가 발생하던 하지않던,connection은 닫아주어야 하므로, 순서대로 close한다.
             // resultset을 가장 먼저 닫고, 그다음 preparedStatement, connection 순

} }

     private void close(Connection con, Statement stmt, ResultSet rs) {
         if (rs != null) {         
	         try {
                 rs.close();

             } catch (SQLException e) {
                 log.info("error", e);

} }

         if (stmt != null) {
             try {

                 stmt.close();
             } catch (SQLException e) {

                 log.info("error", e);
             }

}

         if (con != null) {
             try {

                 con.close();
             } catch (SQLException e) {

                 log.info("error", e);
             }

} }

     private Connection getConnection() {
         return DBConnectionUtil.getConnection();

} }
```
- 조회
	```JAVA
	public Member findById(String memberId) throws SQLException {
     String sql = "select * from member where member_id = ?";

     Connection con = null;
     PreparedStatement pstmt = null;
     ResultSet rs = null;

     try {
         con = getConnection(); //connection 획득
         pstmt = con.prepareStatement(sql); //파라미터 바인딩
         pstmt.setString(1, memberId); // 값 등록
		rs = pstmt.executeQuery(); // 결과를 ResultSet에 담아서 반환한다.
      if (rs.next()) { //ResultSet은 0 부터 시작, 조회된 값이 있다면 다음에 값이 나온다. 
				      //next()를 하여 값을 가져오고, Member 객체에 저장함. 
             Member member = new Member();
             member.setMemberId(rs.getString("member_id"));
             member.setMoney(rs.getInt("money"));
             return member;

         } else {
             throw new NoSuchElementException("member not found memberId=" +

	memberId); }

     } catch (SQLException e) {
         log.error("db error", e);
         throw e;

     } finally {
         close(con, pstmt, rs);

	} }
	
- 수정
	```JAVA
	public void update(String memberId, int money) throws SQLException {
     String sql = "update member set money=? where member_id=?";

     Connection con = null;
     PreparedStatement pstmt = null;

     try {
         con = getConnection();
         pstmt = con.prepareStatement(sql);
         pstmt.setInt(1, money);
         pstmt.setString(2, memberId);
         int resultSize = pstmt.executeUpdate(); // 수정한 쿼리를 날림. 이때 영향받은 row
										         //를 반환한다.
         log.info("resultSize={}", resultSize);

     } catch (SQLException e) {
         log.error("db error", e);
         throw e;

     } finally {
         close(con, pstmt, null);

	} }
- 삭제
	```JAVA
	public void delete(String memberId) throws SQLException {
     String sql = "delete from member where member_id=?";

     Connection con = null;
     PreparedStatement pstmt = null;

     try {
         con = getConnection();
         pstmt = con.prepareStatement(sql);
         pstmt.setString(1, memberId);

         pstmt.executeUpdate(); //수정과 동일하게 업데이트 쿼리를 날리면, sql에 의해 제거

     } catch (SQLException e) {
         log.error("db error", e);
         throw e;

     } finally {
         close(con, pstmt, null);

} }
```