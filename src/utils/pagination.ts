import { InternalErrorResponse } from "../core/ApiResponse"

export const paginate = async (model, query) => {
   
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    // Filters seup

    if(query["page"]) delete query["page"];
    if(query["limit"]) delete query["limit"];
    Object.keys(query).forEach(function(key) {
      if (!Boolean(query[key])) delete query[key];
    });
    query.is_deleted = false
    // Filter setup ends

    // search setup

    if (query.search_query){
      let searchRegex = new RegExp(query.search_query, 'i');
      query.search_query = searchRegex; 
      delete Object.assign(query, {[query.search_field]: query["search_query"] })["search_query"];
      delete query['search_field']
    }
    // search setup ends

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    var next;
    var previous;

    if (endIndex < await model.countDocuments(query).exec()) {
      next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      // const results = await model.find(query).populate(populate_paths).limit(limit).skip(startIndex).exec();
      const filter_query = query;
      return {previous, next, limit, startIndex, filter_query};
    } catch (e) {
      console.log("error :", e)
      throw new InternalErrorResponse();
    }
  }