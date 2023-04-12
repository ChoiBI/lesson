// 메뉴 데이터
const menuData = [
    { name: '아메리카노', price: 2500 },
    { name: '카페라떼', price: 3000 },
    { name: '카푸치노', price: 3500 },
    { name: '에스프레소', price: 2000 },
    { name: '바닐라 라떼', price: 3500 },
  ];
  
  // 메뉴 아이템을 생성하여 반환하는 함수
  function createMenuItem(name, price) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
  
    const nameElem = document.createElement('h3');
    nameElem.innerHTML = name;
    menuItem.appendChild(nameElem);
  
    const priceElem = document.createElement('p');
    priceElem.innerHTML = price + '원';
    menuItem.appendChild(priceElem);
  
    return menuItem;
  }
  
  // 메뉴판에 메뉴를 추가하는 함수
  function addMenuItems() {
    const menuContainer = document.getElementById('menu-container');
    for (let i = 0; i < menuData.length; i++) {
      const menuItem = createMenuItem(menuData[i].name, menuData[i].price);
      menuContainer.appendChild(menuItem);
    }
  }
  
  // 초기화 함수
  function init() {
    addMenuItems();
  }
  
  // 초기화 함수 호출
  init();