***
## 01. DOM

- 문서 객체 모델(Document Object Mdel) : 객체 지향 모델로써 구조화된 문서를 표현하는 형식 , 줄 글로 된 형식을 트리화로 바꿔주는 모델을 말함. DOM은 XML 이나 HTML 문서의 프로그래밍 **인터페이스**  제공
	- DOM은 문서의 구조화된 표현(structured representation)을 제공, 프로그래밍 언어가 문서 구조 , 스타일, 내용 등을 변경할 수 있게 함.
	- Core Dom : 모든 문서 타입을 위한 DOM 모델
	- HTML DOM : HTML 문서를 위한 DOM 모델, HTML 문서를 조작하고 접근하는 표준화된 방법. 모든 HTML 요소는 HTML DOM을 통해 접근 가능하다.
	- XML DOM : 문서를 위한 DOM 모델, XML 문서에 접근하여 그 문서를 다루는 표준화된 방법을 정의, 모든 XML요소는 XML DOM을 통해 접근이 가능하다.
	
	 - Document 객체 : 웹페이지르 의미한다. 웹 페이지에 존재하는 HTML요소에 접근하고자 할 때는 반드시 **Document 객체**부터 시작해야 한다. 
	 -Document 메소드 : HTML 요소와 관련된작업을 도와주는 다양한 메소드 제공 
	 - HTML 요소의 선택 : 새로운 HTML 요소를 선택하기 위해 제공되는 메소드
		 - `document.getElementById()` : 해당 아이디의 요소를 선택
		 - `document.getElementsByClassName()` : 해당 클래스에 속한 요소를 선택
		 - `document.getElementsByName()` : 해당 name 속성값을 가지는 요소를 선택
		 - `document.querySelectorALL()` : 해당 선택자로 선택되는 요소를 모두 선택
	     - `document.querySelector()` : 해당 선택자로 선택되는 요소를 1개 선택
	 - HTML 요소의 생성
		 - `document.createElement()` : 지정된 HTML 요소를 생성
		 - `document.write()` : HTML 출력 스트림을 통해 텍스트를 출력
	 - HTML 이벤트 핸들러 추가
		 - `요소.onclick = function(){}` : 마우스 클릭 이벤트와 연결될 이벤트 핸들러, 해당 요소를 클릭했을 때 실행이 됨.
	 - HTML 객체의 선택
	 - DOM의 트리 구조(HTML -> DOM)
```html
<DOCTYPE html>
		<html>
		<head>
			<title>자바스크립트 기초</title>
		</head>
		<body>
			<article>
				<header>header</header>
				<section>
				<header>header 1</header>
				section 1
				</section>
			</article>
		</body>
		</html>
```
		html 태그의 묶인 부분에 따라서 위와 같은 트리 구조로 표현할 수 있음.
***
## 02. 자바스크립트와 DOM

- DOM 요소의 선택
```js
	//HTML <li> 요소를 선택
	var selectedItem = document.getElementsByTagName("li");
	
	//아이디가 "id"인 요소를 선택
	var selectedItem = document.getElementsById("id");
	
	//클래스가 "odd"인 요소를 선택
	var selectedItem = document.getElementsByClassName("odd");
	
	//name 속성값이 "first"인 요소를 선택
	var selectedItem = document.getElementsByName("first");
```
	
- DOM 요소의 스타일 변경
```js
	//아이디가 "even"인 요소를 선택
	var selectedItem = document.getElementById("even");
	
	//선택된 요소의 텍스트 색상을 변경 (style 속성의 색 변경)
	selectedItem.style.color = "red"
```
	
- DOM 요소의 내용 변경
```js
	//아이디가 "test"인 요소를 선택
	var str = document.getElementById("text");
	
	//선택된 요소의 내용을 변경
	str innerHTML = "요소의 내용을 바꿉니다";
```
***
## 03. Node 객체

- Node와 Node Tree
	- HTML DOM 에서 정보를 저장하는 계층적 단위
	- Node Tree 는 Node들의 집합으로, 노드 간의 관계를 나타낸다.
	- 자바스크립에서 HTML DOM을 이용하여 노드 트리에 포함된 모든 노드에 접근할 수 있다.![DOM과 이벤트-20250119154329724.webp](images%2FDOM%EA%B3%BC%20%EC%9D%B4%EB%B2%A4%ED%8A%B8-20250119154329724.webp)
	
#### 노드 간의 관계 

- 노드 트리의 모든 노드는 서로 **계층적 관계**를 맺고 있다.![DOM과 이벤트-20250119154340497.webp](images%2FDOM%EA%B3%BC%20%EC%9D%B4%EB%B2%A4%ED%8A%B8-20250119154340497.webp)
#### 노드의 종류
- 문서노드(document node) : HTML 문서 전체를 나타내는 노드
- 요소노드(element node) : 모든 HTML 요소는 요소 노드로, 속성 노드를 가질 수 있는 유일한 노드
- 주석노드(comment node) : HTML 문서의 모든 주석은 주석노드
- 속성노드(attribute node) : 모든 HTML 요소의 속성은 속성 노드이며, 요소 노드에 관한 정보를 가진다. 하지만 해당 요소 노드의 자식 노드(child node)에는 포함되지 않는다.
- 텍스트노드 (text node) : HTML 문서의 모든 텍스트는 텍스트 노드 (`<p> 텍스트 노드 </p>`)
	
#### 노드의 값
노드에 대한 정보는 다음과 같은 프로퍼티를 통해 접근할 수 있다.
		nodeName(이름), nodeValue(값), nodeType(타입)
```js
		//HTML 문서의 모든 자식 노드 중에서 첫 번째 노드의 이름을 선택
		document.childNodes[0].nodeName;
		//아이디가 "heading"인 요소의 첫 번째 자식 노드의 노드값을 선택
		document. getElementById("heading").firstchild.nodeValue;
		//아이디가 "heading"인 요소의 첫 번째 자식 노드의 타입을 선택
		document.getElementById("heading").firstchild.nodeType;
```
***

## 04. 이벤트(Event)
- 웹 브라우저가 알려주는 HTML 요소에 대한 **사건의 발생**, 자바스크립트는 발생한 이벤트에 반응하여 특정 동작을 수행할 수 있다. ex) 마우스 움직임, 마우스 클릭 등
	
	 #### 이벤트 타입
	- 발생한 이벤트의 종류 (폼, 키보드, 마우스, HTML DOM, Window 객체 등)
```js
	//마우스클릭 이벤트 예시
	<p onclick = "changeText(this)"> 여길 클릭하세요!</p>
	//this 는 여기서 자기 자신을 의미함. changeText 함수는 밑의 함수로 실행
	
	<script>
	function changeText(element){
	element.innerHTML = "내용이 바뀌었습니다!";
	}
	</script>	
```
- 
	#### 이벤트 핸들러
	- 이벤트가 발생했을 때 그 처리를 담당하는 함수, 지정된 이벤트가 발생하면, 웹 브라우저는 그 요소에 등록된 이벤트 핸들러를 실행시킨다.
```js
	//이 함수는 HTML 문서가 로드될 때 실행됨.
	window.onload = function(){
	//아이디가 "text"인 요소를 선택
	var text = document.getElementById("text");
	text.innerHTML = "HTML 문서가 로드되었습니다.";
	}
```
- `addEventListener : 대상객체.addEventListener(이벤트명, 실행할 이벤트핸들러, 이벤트전파방식)`
