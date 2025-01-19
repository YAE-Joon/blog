***
## 01. CSS란?

- CSS는 **Cascading Style Sheet**의 약자로, HTML로 작성된 정보를 꾸며주는 언어 
- HTML과 디자인을 분리해 문서의 스타일과 레이아웃을 정의
- 기본 형식
```css
    선택자 {   
    속성: 속성값; 
    }
```    
- 선택자: 스타일을 적용할 HTML 영역 (ex. h1, p)
- 속성: 적용할 디자인 요소 (ex. color, font-size)
- 속성값: 구체적인 디자인 값 (ex. red, 20px)
- ex) 
```css
    h1 {   
    font-size: 20px;   font-family: sans-serif;   color: blue;   background-color: yellow;   text-align: center; 
    } 
```

***
## 02. CSS 연동 방법

2.1 **Inline Style Sheet**
    
- HTML 태그 안에 직접 스타일을 적용하는 방식       
```html
	<h1 style="color: red;">Hello, World!</h1>
```        
2.2 **Internal Style Sheet**
    
- HTML 파일의 `<style>` 태그 안에서 스타일을 지정하는 방식
```html
	<head>  
	 <style>    
	  h1 {       
	  background-color: yellow;     
	  }  
	   </style> 
   </head>
```
2.3 **External Style Sheet**
    
- CSS 파일을 별도로 만들어서 HTML 문서와 연결하는 방식
```html
    <head>   <link rel="stylesheet" href="style.css"> </head>
```        

---

## 03. CSS 선택자

- **Type 선택자**
    - 특정 태그에 스타일을 적용하는 방식
```css
 h2 {
    color: red; 
 }
```        

- **Class 선택자**
    - 태그에 별명을 붙여 스타일을 적용
```html     
        <h2 class="title">Hello</h2>
```   

```css
        .title {   color: blue; }
```

- **ID 선택자**
    - 태그에 ID를 부여해 스타일을 적용. 
    - ID는 페이지 내에서 고유함.
```html
<h2 id="heading">Hello</h2>
```

```css
    #heading {   color: green; }
```        

---

## 04. 부모 자식 관계

- 부모 태그가 자식 태그를 포함하는 관계를 의미. 
- 예를 들어, `<header>` 태그는 `<h1>`과 `<p>` 태그를 포함할 수 있음.
- 부모에게 스타일을 적용하면 자식에게도 상속. 원하는 영역에만 스타일을 적용하려면 부모를 구체적으로 지정해야 함.
    
```html
    <header> 
      <h1>Title</h1>  
       <p>Description</p> 
   </header>
```

``` css
  header {  
     color: red;
      }   
  header h1 {   
      color: blue; 
      }  
  header p {   
      color: green; 
      }
```

---
## 05. 캐스케이딩

- CSS의 우선순위를 결정하는 규칙 
- 다음 세 가지 요소가 있음
    1. **순서**: 나중에 작성된 스타일이 우선 적용
    2. **디테일**: 선택자가 구체적일수록 우선 적용
    3. **선택자 종류**: 우선순위는 `style > ID > class > type` 순

---
## 06. 주요 CSS 속성

- **width, height**: 선택한 요소의 크기를 설정
```CSS
    width: 100px; height: 200px;
```    
- **font-family**: 글꼴을 설정할 때 사용.
```css
    font-family: Arial, sans-serif;
```    
- **border**: 테두리를 설정하는 속성
``` css
border: 1px solid black;
```    
- **background**: 배경색이나 배경 이미지를 설정
```css
    background-color: yellow; background-image: url('image.png');
```

---
