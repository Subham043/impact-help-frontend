import { FiHome, FiHelpCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { BsChat, BsCheck2Square } from "react-icons/bs";

const menus = [
    {
        name:'Dashboard',
        link:'/admin/dashboard',
        icon:<FiHome className="icon" />
    },
    {
        name:'Support Tickets',
        link:'/admin/support-ticket',
        icon:<BsCheck2Square className="icon" />
    },
    // {
    //     name:'Chat',
    //     link:'/admin/chat',
    //     icon:<BsChat className="icon" />
    // },
];

export default menus;