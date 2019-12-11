document.addEventListener('DOMContentLoaded', ()=> {

    
const Autocomplete = (selector, data) => {

  let inputs = document.querySelectorAll(selector);

  function ciSearch(what = '', where = '') {
    return where.toUpperCase().search(what.toUpperCase());
  }
  
  inputs.forEach(input => {


    let wrap = document.createElement('div');
    wrap.className = 'autocomplete-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    let list = document.createElement('div');
    list.className = 'select';
    wrap.appendChild(list);

    let line = document.createElement('div');
    line.className = 'input__line';
    wrap.appendChild(line);

    let matches = [];
    let listItems = [];
    let focusedItem = -1;

    function setActive(active = true) {
      if(active)
        wrap.classList.add('active');
      else
        wrap.classList.remove('active');
    }

    function focusItem(index) {
      if(!listItems.length) return false;
      if(index > listItems.length - 1) return focusItem(0);
      if(index < 0) return focusItem(listItems.length - 1);
      focusedItem = index;
      unfocusAllItems();
      listItems[focusedItem].classList.add('focused');
    }
    function unfocusAllItems() {
      listItems.forEach(item => {
        item.classList.remove('focused');
      });
    }
    function selectItem(index) {
      if(!listItems[index]) return false;
      input.value = listItems[index].innerText;
      setActive(false);
    }

    input.addEventListener('input', () => {

      let value = input.value;
      if(!value) return setActive(false);

      list.innerHTML = '';
      listItems = [];

      data.forEach((dataItem, index) => {

        let search = ciSearch(value, dataItem);
        if(search === -1) return false;
        matches.push(index);

        let parts = [
          dataItem.substr(0, search),
          dataItem.substr(search, value.length),
          dataItem.substr(search + value.length, dataItem.length - search - value.length)
        ];

        let item = document.createElement('div');
        item.className = 'option';
        item.innerHTML = parts[0] + '<strong>' + parts[1] + '</strong>' + parts[2];
        list.appendChild(item);
        listItems.push(item);

        item.addEventListener('click', function() {
          selectItem(listItems.indexOf(item));
        });

      });

      if(listItems.length > 0) {
        focusItem(0);
        setActive(true);
      }
      else setActive(false);

    });


    document.body.addEventListener('click', function(e) {
      if(!wrap.contains(e.target)) setActive(false);
    });

  });

}

fetch('./data.json').then(data => {
        data.json().then(json => {
        let fonts = json.fonts
        Autocomplete('#autocomplete', fonts)
    });
  });

});
