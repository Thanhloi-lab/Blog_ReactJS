const Handlebars = require('handlebars');



module.exports = {
    sum:(a, b) => a + b,
    sortable:(field, sort)=>{
      const sortType = field === sort.column ? sort.type : 'default';

      const icons = {
        default: 'fas fa-sort sort-icon-color',
        desc:'fas fa-sort-amount-down sort-icon-color',
        asc:'fas fa-sort-amount-up sort-icon-color'
      }
      const types ={
        default: 'desc',
        desc:'asc',
        asc:'desc'
      }

      const type = types[sortType];
      const icon = icons[sortType];

      const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type ? type : types.asc}`);

      const output = `<a href="${href}">
                        <i class="${icon ? icon : icons.desc}"></i>
                    </a>`
      return new Handlebars.SafeString(output);
    }
  }