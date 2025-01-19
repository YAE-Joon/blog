***
## 1. JDBC Template 설정
- JDBC template : spring-jdbc 라이브러리에 포함되어 있는데, 복잡한 설정 없이 바로 사용 가능
- build.gradle 에 `org.springframework.boot:spring-boot-starter-jdbc` 를 추가하면 JdbcTemplate이 들어있는 spring-jdbc가 라이브러리에 포함된다. 
- 템플릿 콜백 패턴을 사용해서, JDBC를 직접 사용할 때 발생하는 대부분의 반복 작업을 대신 처리해준다.
- 개발자는 SQL을 작성하고, 전달 파라미터 정의, 응답 값을 매핑 작업만 수행
- 대신 처리해주는 반복 작업
	- 커넥션 획득
	- statement 를 준비하고 실행
	- 결과를 반복하도록 루프 실행
	- 커넥션 종료, statement, resultset 종료
	- 트랜잭션 다루기 위한 커넥션 동기화
	- 예외 발생시 스프링 예외 변환기 실행
	
```JAVA
package hello.itemservice.repository.jdbctemplate;

 import hello.itemservice.domain.Item;
 import hello.itemservice.repository.ItemRepository;
 import hello.itemservice.repository.ItemSearchCond;
 import hello.itemservice.repository.ItemUpdateDto;
 import lombok.extern.slf4j.Slf4j;
 import org.springframework.dao.EmptyResultDataAccessException;
 import org.springframework.jdbc.core.JdbcTemplate;
 import org.springframework.jdbc.core.RowMapper;
 import org.springframework.jdbc.support.GeneratedKeyHolder;
 import org.springframework.jdbc.support.KeyHolder;
 import org.springframework.stereotype.Repository;
 import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * JdbcTemplate
 */

@Slf4j
@Repository
public class JdbcTemplateItemRepositoryV1 implements ItemRepository {

    private final JdbcTemplate template;

    public JdbcTemplateItemRepositoryV1(DataSource dataSource) {
    //JDBC template 은 datasource를 의존관계 주입 받고 생성자 내부에서 Jdbc tmplate을 생성
        this.template = new JdbcTemplate(dataSource);
        //받은 datasource에 의해 커넥션을 획득할 수 있음.

}

    @Override    
    public Item save(Item item) {
        String sql = "insert into item (item_name, price, quantity) values (?, ?, ?)";
		/**PK 인 Id 는 데이터베이스에서 직접 증가시키는 identity(auto increment)방식을 사용,
		 비워두고 저장해야 한다.데이터베이스가 id를 직접 증가시키게 되면, 데이터베이스에 Insert가
		  완료 되어야 생성된 PK ID값을 확인할 수 있다.**/
        KeyHolder keyHolder = new GeneratedKeyHolder();
        /**KeyHolder 와 connection.prepareStatement(sql,new String[]{id""})를 사용
        해서 id를 지정해주면, insert 쿼리 후 데이터베이스에서 생성된 ID 값을 조회할 수 있
        다. 즉, id는 데이터베이스에서 자동으로만들어주기 때문에, database에서 조회해야한다.**/
        template.update(connection -> {
			/**template.update()는 데이터를 변경할 때 사용하면 된다.Insert,UPDATE,DELETE
			에서 사용한다. 반환값은 int로, 반환한 row 값이다.**/
			PreparedStatement ps = connection.prepareStatement(sql, new String[]
			{"id"});
			ps.setString(1, item.getItemName());
			ps.setInt(2, item.getPrice());
			ps.setInt(3, item.getQuantity());
			return ps;
		}, keyHolder);

		long key = keyHolder.getKey().longValue();
		item.setId(key);
		return item;

}

    @Override   
    public void update(Long itemId, ItemUpdateDto updateParam) {

        String sql = "update item set item_name=?, price=?, quantity=? where id=?";
		
			template.update(sql,  
				updateParam.getItemName(),
				updateParam.getPrice(),
				updateParam.getQuantity(),
				itemId);
	}
        /**update()는 데이터를 변경할 떄 사용. ?에 바인딩할 파라미터를 하나씩 전달하면 된다.
        반환값은 해당 쿼리의 영향을 받은 로우 수 이다. 여기서는 where id=?를 지정했기 때문에 영향 받
        은 로우수는 최대 1개이다.**/
	    
    @Override    
    public Optional<Item> findById(Long id) {
        String sql = "select id, item_name, price, quantity from item where id =?";
		
        try {
            Item item = template.queryForObject(sql, itemRowMapper(), id);
            /**template.queryForObject()는 결과 로우가 하나일 때 사용, 
            RowMapper는 데이터베이스의 반환 결과인 ResultSet을 객체로 변환한다. 만약 결과가 없을
            경우 EmptyResultDataAccessException 예외가 발생한다. 결과가 둘 이상일 경우
            IncorrectResultSizeDataAccessException 예외가 발생한다.**/
            return Optional.of(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
            /**ItemRepository.findById() 인터페이스는 결과가 없을 때 Optional을 반환해야
            한다. 따라서 결과가 없으면 예외를 잡아서 Optional.empty를 대신 반환하면 된다.**/
		}
	}
	
    @Override
        public List<Item> findAll(ItemSearchCond cond) {
        String itemName = cond.getItemName();
        Integer maxPrice = cond.getMaxPrice();
		
		String sql = "select id, item_name, price, quantity from item"; 
		//동적 쿼리  
		if (StringUtils.hasText(itemName) || maxPrice != null) {
            sql += " where";
        }
        
        boolean andFlag = false;
        List<Object> param = new ArrayList<>();
        if (StringUtils.hasText(itemName)) {
		
            sql += " item_name like concat('%',?,'%')";
            param.add(itemName);
            andFlag = true;
		}
		
        if (maxPrice != null) {
            if (andFlag) {
                sql += " and";
            }
            sql += " price <= ?";
            param.add(maxPrice);
            }
			
         log.info("sql={}", sql);
         return template.query(sql, itemRowMapper(), param.toArray());
         /**template.query는 결과값이 하나이상일 때 사용. RowMapper는 데이터베이스의 반환 결과
         인 ResultSet을 객체로 변환한다. 결과가 없으면 빈 컬렉션을 반환한다.**/
     }

     private RowMapper<Item> itemRowMapper() {
         return (rs, rowNum) -> {
             Item item = new Item();
             item.setId(rs.getLong("id"));
             item.setItemName(rs.getString("item_name"));
             item.setPrice(rs.getInt("price"));
             item.setQuantity(rs.getInt("quantity"));
             return item;
		}; 
		/**데이터베이스의 조회 결과를 객체로 변환할 대 사용한다. JDBC를 직접 사용할 때 ResultSet를
		사용했던 부분을 떠올리면 된다. 차이가 있다면 다음과 같이 JdbcTemplate이 다음과 같은 루프를
		 돌려주고, 개발자는 RowMapper를 구현해서 그 내부 코드만 채운다고 이해하면 된다.
		 while(resultSet이 끝날때 까지){
		 rowMapper(rs, rowNum)}**/
	}
}
```
***
## 2. BeanPropertyRowMapper

- ResultSet의 결과를 받아서 JavaBean 규약에 맞추어 데이터를 변환한다. 
	```JAVA
	private RowMapper<Item> itemRowMapper() {  
	return BeanPropertyRowMapper.newInstance(Item.class); //camel 변환 지원
	}

위와 같은 RowMapper를 이용하면 
	```JAVA
	Item item = new Item();
	item.setId(rs.getLong("id"));
	item.setPrice(rs.getInt("price"));
	```
데이터베이스에서 조회한 결과 이름을 기반으로 setId(), setPrice()처럼 Java bean property 규약에 맞춘 메서드를 호출한다.
- 별칭의 경우 (item_name)은 setItem_name()이라는 메서드가 없기 때문에, 개발자가 조회 SQL을 
`select item_name as itemName`으로 고치면 된다.
- snake_case의 경우 자동으로 해결이 되기 때문에, 그냥 두어도 문제없이 들어간다.
***
## 3. SimpleJdbcInsert
- JdbcTemplate은 INSERT SQL를 직접 작성하지 않아도 되도록 SimpleJdbcInsert라는 편리한 기능을 제공한다.
ex)
```JAVA
package hello.itemservice.repository.jdbctemplate;
import hello.itemservice.domain.Item;
import hello.itemservice.repository.ItemRepository;
import hello.itemservice.repository.ItemSearchCond;
import hello.itemservice.repository.ItemUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * SimpleJdbcInsert
 */

@Slf4j
@Repository
public class JdbcTemplateItemRepositoryV3 implements ItemRepository {

	private final NamedParameterJdbcTemplate template;
	private final SimpleJdbcInsert jdbcInsert;
	
	public JdbcTemplateItemRepositoryV3(DataSource dataSource) {
	    this.template = new NamedParameterJdbcTemplate(dataSource);
		
		this.jdbcInsert = new SimpleJdbcInsert(dataSource) 
			.withTableName("item") // 데이터를 저장할 테이블 명을 지정
			.usingGeneratedKeyColumns("id") // PK column명을 지정한다.
			.usingColumns("item_name", "price", "quantity"); 
			//INSert에 사용할 칼럼을 지정. 특정 값만 저장할고 싶을 대 사용. 
			//생성시점에서 테이블의 메타 데이터를 조회하기 때문에 생략이 가능하다.
	}   /**SimpleJdbcInsert는 내부에서 생성해서 가지고 있고, datasource는 의존관계
	주입을 통해서 받는다.**/
		
	@Override
	public Item save(Item item) {
	    SqlParameterSource param = new BeanPropertySqlParameterSource(item);
	    Number key = jdbcInsert.executeAndReturnKey(param);
	    item.setId(key.longValue());
        return item;
    }//save부분이 매우 간결해 졌다.

    @Override    
    public void update(Long itemId, ItemUpdateDto updateParam) {
        String sql = "update item " +
                "set item_name=:itemName, price=:price, quantity=:quantity " +
                "where id=:id";
				
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("itemName", updateParam.getItemName())
                .addValue("price", updateParam.getPrice())
                .addValue("quantity", updateParam.getQuantity())
                .addValue("id", itemId);
				
        template.update(sql, param);
    }

    @Override    
    public Optional<Item> findById(Long id) {
        String sql = "select id, item_name, price, quantity from item where id = :id";
        try {
            Map<String, Object> param = Map.of("id", id);
            Item item = template.queryForObject(sql, param, itemRowMapper());
            return Optional.of(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
		} 
	}

    @Override    
    public List<Item> findAll(ItemSearchCond cond) {
	    
        Integer maxPrice = cond.getMaxPrice();
        String itemName = cond.getItemName();
		
        SqlParameterSource param = new BeanPropertySqlParameterSource(cond);
		
		String sql = "select id, item_name, price, quantity from item"; 
		//동적 쿼리  
		if (StringUtils.hasText(itemName) || maxPrice != null) {
			sql += " where";
		}
		
         boolean andFlag = false;
         if (StringUtils.hasText(itemName)) {
			 sql += " item_name like concat('%',:itemName,'%')";
             andFlag = true;
         }
		
         if (maxPrice != null) {
             if (andFlag) {
				 sql += " and";
             }
             sql += " price <= :maxPrice";
         }
		
         log.info("sql={}", sql);
		
         return template.query(sql, param, itemRowMapper());
     }
	
     private RowMapper<Item> itemRowMapper() {
         return BeanPropertyRowMapper.newInstance(Item.class);
	} 
}
```