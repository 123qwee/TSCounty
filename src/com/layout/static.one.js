import one from '../../templates/module/module.static.one.html';
import service from "../services/service.js";

export class staticOne {
    init() {
        let template = Handlebars.compile(one);
        service.requestCommunityInfo(lscache.get('userName').communtiyCode, data => {
            let html = template(data.data);
            $(".page-1-1").empty().append(html);
        });
    };
}
