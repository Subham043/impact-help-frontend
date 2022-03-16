import { FiHome, FiHelpCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { BsChat, BsCheck2Square } from "react-icons/bs";

const menus = [
    {
        name:'Dashboard',
        link:'/dashboard',
        icon:<FiHome className="icon" />
    },
    {
        name:'Create New Ticket',
        link:'/create-ticket',
        icon:<FaRegEdit className="icon" />
    },
    {
        name:'Support Tickets',
        link:'/support-ticket',
        icon:<BsCheck2Square className="icon" />
    },
    // {
    //     name:'Chat',
    //     link:'/chat',
    //     icon:<BsChat className="icon" />
    // },
    {
        name:'FAQ',
        link:'/faq',
        icon:<FiHelpCircle className="icon" />
    },
];

export default menus;